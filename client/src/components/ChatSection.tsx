import React, { useEffect, useState } from 'react';
import '../styles/chat.css';
import { useConnectSocket } from '../hoocs/useConnectSocket';
import { useUsers } from '../hoocs/useUsers';
import { useMessages } from '../hoocs/useMessages';
import sendimg from '../assets/send.png';
import msg_icon from '../assets/msg.png';
import axios from 'axios';
import ChatRoomMsgs from './ChatRoomMsgs';
import ChatRoom from './ChatRoom';
import { IUser, IUserChats } from '../types/types';
import Alert from '../pages/Alert';

interface Props {
  currentUserId: number;
  curUsername: string;
}

const ChatSection: React.FC<Props> = ({ currentUserId, curUsername }) => {
  useConnectSocket(currentUserId);
  const { users } = useUsers();
  const { messages, newMessage, setNewMessage, sendMessage } = useMessages(curUsername);

  const [isGlobalChat, setIsGlobalChar] = useState<boolean>(false);
  const [userChats, setUserChats] = useState<IUserChats[]>([]);
  const [selectedUserChat, setSelectedUserChat] = useState<boolean | null>(null);

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null)

  const handleCreateChatRoom = async (userId: number) => {
    try {
      const userIds = [currentUserId, userId];
      const res = await axios.post('http://localhost:3030/chat-rooms/createroom', {
        userIds,
      });
      if (res.data.success === true) {
        setAlertMessage('Чат создан успешно!');
        setShowAlert(true);
        setIsSuccess(true);
        setTimeout(() => setShowAlert(false), 3000);
      } else {
        setAlertMessage('У вас уже есть чат');
        setShowAlert(true);
        setIsSuccess(false);
        setTimeout(() => setShowAlert(false), 3000);
      }
    } catch (e) {
      console.error('Error creating chat room:', e);
    }
  };

  const getRooms = async (currentUserId: number) => {
    try {
      const data = await axios.post('http://localhost:3030/chat-rooms/getchatroom',{
        userIds: [currentUserId]
      });
      setUserChats(data.data)
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getRooms(currentUserId);
  }, [currentUserId, userChats]);

  return (
    <div className='chat'>
        {!isGlobalChat ?
            <div className='allusers'>
                <div className='chat_title_text'>
                <h2>All Users</h2>
                  <div>
                    <h3>Чтобы создать закрытый чат нажмите</h3>
                    <img src={msg_icon}/>
                  </div>
                  
                </div>
                {users.map((user: IUser) => (
                <li className='single_user' key={user.id} style={{backgroundColor: '#2b5278'}}>
                  <div>
                    <div className='user_avatar'>{user.username.slice(0, 2)}</div>
                    <h2>{user.username}</h2>
                  </div>
                  <button 
                  onClick={() => handleCreateChatRoom(user.id)}
                  className={currentUserId === user.id ? 'hidden_img' : ''}>
                    <img src={msg_icon} />
                  </button>
                </li>
              ))}
            </div> :
            <div className='allusers'>
                <ChatRoom 
                selectedUserChat={selectedUserChat}
                userChats={userChats}
                setSelectedUserChat={setSelectedUserChat}
                />
            </div>}

      <div className='chat_window'>
      <section className='buttons_chat'>
            <button onClick={() => setIsGlobalChar(false)} className={isGlobalChat ? '' : 'activechat'}>GlobalChat</button>
            <button onClick={() => setIsGlobalChar(true)} className={isGlobalChat ? 'activechat' : ''}>My Chats</button>
        </section>

        <div className="socket_chat">
            {!isGlobalChat ?
            <div className='msges'>
            {messages.map((msg: any) => (
                <div className='single_message' key={msg.message_id}>
                  <strong>{msg.curusername}: </strong>
                  <h1>{msg.content}</h1>
                  <small>{new Date(msg.timestamp).toLocaleString()}</small>
                </div>
            ))}
            </div> 
            :
              <ChatRoomMsgs 
                currentUserId={currentUserId}
                curUsername={curUsername}
                userChats={userChats}
                selectedUserChat={selectedUserChat}
              />
            }
        </div>

        {!isGlobalChat ?
            <div className='send_msg'>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={sendMessage} disabled={!newMessage.trim()}>
                  <img src={sendimg} alt='send'/>
                </button>
          </div>:''
        }
      </div>
      {showAlert && <Alert isSuccess={isSuccess} alertMessage={alertMessage} showAlert={showAlert} />}
    </div>
  );
};

export default ChatSection;