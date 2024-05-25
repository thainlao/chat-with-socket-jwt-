import React, { useEffect, useState } from "react";
import { IMessage, IUser, IUserChats } from "../types/types";
import SocketApi from "../api/socket_api";
import sendimg from '../assets/send.png';
import axios from "axios";

interface Props {
  selectedUserChat: any;
  userChats: IUserChats[];
  currentUserId: number;
  curUsername: string;
}

const ChatRoomMsgs: React.FC<Props> = ({ userChats, selectedUserChat, curUsername }) => {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [usersFromChat, setUsersFromChat] = useState<IUser[]>([])
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (selectedUserChat) {
      setLoading(true); // Start loading
      setMessages([]);
      SocketApi.joinChatRoom(selectedUserChat);
      fetchMessages(selectedUserChat);

      SocketApi.onReceivePrivateMessage((message) => {
        if (message.chatRoomId === selectedUserChat) {
          setMessages(prevMessages => [...prevMessages, message]);
        }
      });
      getCurrentUsers();
    }
  }, [selectedUserChat]);

  const sendMessage = async () => {
    if (newMessage.trim() !== '') {
      const message = {
        chatRoomId: selectedUserChat,
        curUsername: curUsername,
        content: newMessage,
        timestamp: new Date().toISOString()
      };
      await axios.post('http://localhost:3030/chat-rooms/sendmessage', message);
      SocketApi.sendPrivateMessage(message.chatRoomId, message.curUsername, message.content);
      setNewMessage('');
    }
  }

  const fetchMessages = async (chatRoomId: number) => {
    try {
      const res = await axios.get(`http://localhost:3030/chat-rooms/messages/${chatRoomId}`);
      if (res.data && res.data.length > 0) {
        // Ensure all messages have curUsername property
        const updatedMessages = res.data.map((msg: any) => ({
          ...msg,
          curUsername: msg.curUsername || curUsername
        }));
        setMessages(updatedMessages);
      } else {
        console.log('No messages found for this chat room');
        setMessages([]); // Set messages to an empty array if no messages are found
      }
    } catch (error) {
      console.error('Error while fetching messages:', error);
      setMessages([]); // Ensure that messages are reset to an empty array in case of error
    } finally {
      setLoading(false); // End loading
    }
  };

  const selectedChat = userChats.find(chat => chat.chat_room_id === selectedUserChat);

  const getCurrentUsers = async () => {
    if (!selectedChat?.user_ids) {
      return;
    }
    try {
      const res = await axios.post('http://localhost:3030/users/chat-users', {
        ids: selectedChat.user_ids
      });
      setUsersFromChat(res.data);
    } catch (error) {
      console.error('Error while fetching users:', error);
    }
  }

  useEffect(() => {
    if (selectedChat) {
      getCurrentUsers();
    }
  }, [selectedChat]);

  return (
    <div>
      {selectedChat ? (
        <div>
          <div className="data_info">
          {usersFromChat.map((user: IUser) => (
            <h2 key={user.id}>{user.username}</h2>
          ))}
          </div>
          {loading ? (
            <div>Loading...</div> // Show loading indicator
          ) : (
            <div className='chat_messages_close'>
              {messages.map((msg: any) => (
                <div className='single_message' key={msg.message_id}>
                  <h6>{msg.curUsername}</h6> {/* Consistent property naming */}
                  <h1>{msg.content}</h1>
                  <small>{new Date(msg.timestamp).toLocaleString()}</small>
                </div>
              ))}
            </div>
          )}
          <div className='send_msg'>
            <input
              type="text"
              placeholder="text here"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button onClick={sendMessage} disabled={!newMessage.trim()}>
              <img src={sendimg} alt='send'/>
            </button>
          </div>
        </div>
      ) : (
        <h2>Нет выбранного чата</h2>
      )}
    </div>
  );
};

export default ChatRoomMsgs;
