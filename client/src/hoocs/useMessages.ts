import { useState, useEffect } from 'react';
import SocketApi from '../api/socket_api';
import axios from 'axios';

export const useMessages = (curUsername: string) => {
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('http://localhost:3030/chat-rooms/globalmessages');
        setMessages(response.data);
      } catch (error) {
        console.error('Error fetching global messages:', error);
      }
    };

    fetchMessages();

    const handleReceiveMessage = (message: { userId: number, content: string, timestamp: string }) => {
      setMessages(prevMessages => [...prevMessages, message]);
    };

    SocketApi.socket?.on('receive_message', handleReceiveMessage);

    return () => {
      SocketApi.socket?.off('receive_message', handleReceiveMessage);
    };
  }, []);

  const sendMessage = () => {
    if (newMessage.trim() !== '') {
      SocketApi.sendMessage(curUsername, newMessage);
      setNewMessage('');
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    sendMessage,
  };
};