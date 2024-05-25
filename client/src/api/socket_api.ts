import { Socket, io } from "socket.io-client";

class SocketApi {
  static socket: Socket | null = null;

  static createConnection(currentUserId: number) {
    this.socket = io('http://localhost:3030', {
      extraHeaders: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    });

    this.socket.on("connect", () => {
      console.log('connected');
      this.socket?.emit('user_connected', { userId: currentUserId });
    });

    this.socket.on("disconnect", (e) => {
      console.log('disconnect', e);
    });
  }

  static sendMessage(curUsername: string, content: string) {
    this.socket?.emit('send_message', { curUsername, content });
  }

  static joinChatRoom(chatRoomId: number) {
    this.socket?.emit('join_chat_room', chatRoomId);
  }

  static sendPrivateMessage(chatRoomId: number, curUsername: string, content: string) {
    console.log(`username: ${curUsername}, content: ${content}, chatRoomId`)
    this.socket?.emit('send_private_message', { chatRoomId, curUsername, content });
  }

  static onReceivePrivateMessage(callback: (message: any) => void) {
    this.socket?.on('receive_private_message', callback);
  }
}

export default SocketApi;
