import React from "react";

interface Props {
  userChats: any[];
  selectedUserChat: boolean | null;
  setSelectedUserChat: any;
}

const ChatRoom: React.FC<Props> = ({ userChats, selectedUserChat, setSelectedUserChat }) => {

  return (
    <div>
      <h2>Ваши чаты</h2>
      <div className="users_chats">
      {userChats.map((chat) => (
        <li 
        style={{cursor: 'pointer'}}
        onClick={() => setSelectedUserChat(chat.chat_room_id)} 
        key={chat.chat_room_id}
        className={`single_user ${selectedUserChat === chat.chat_room_id ? 'selectedchat' : ''}`}
        >
          <div>
            <h3>Room ID: {chat.chat_room_id}</h3>
            <p>Users: {chat.user_ids.join(', ')}</p>
            <p>{new Date(chat.created_at).toLocaleString()}</p>
          </div>
        </li>
      ))}
      </div>
    </div>
  );
};

export default ChatRoom;