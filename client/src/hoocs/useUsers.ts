import { useState, useEffect } from 'react';
import { IUser } from '../types/types';
import SocketApi from '../api/socket_api';

export const useUsers = () => {
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    const handleUsersList = (usersList: IUser[]) => {
      setUsers(usersList);
    };

    // Listen for users list update events
    SocketApi.socket?.on('users_list', handleUsersList);

    // Fetch user list every second
    const intervalId = setInterval(() => {
      SocketApi.socket?.emit('request_users_list');
    }, 1000);

    return () => {
      SocketApi.socket?.off('users_list', handleUsersList);
      clearInterval(intervalId);
    };
  }, []);

  return {
    users,
  };
};