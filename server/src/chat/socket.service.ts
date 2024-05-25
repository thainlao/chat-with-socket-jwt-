import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import pgClient from '../../db';
import { IUser } from './entities/user.entity';
import { ChatService } from './chat.service';

@WebSocketGateway({ cors: { origin: '*' } })
export class WsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private connectedUsers: IUser[] = [];
  constructor(private readonly chatService: ChatService) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const authHeaderToken = client.handshake.headers.authorization;
    if (authHeaderToken) {
      const token = authHeaderToken.split(' ')[1];
      try {
        const decoded: any = jwt.verify(token, process.env.ACCESS_SECRET);
        const userId = decoded.userId;
        console.log(`User connected with ID: ${userId}`);

        // Fetch user information from the database
        const query = 'SELECT id, username FROM users WHERE id = $1';
        const result = await pgClient.query(query, [userId]);

        if (result.rows.length > 0) {
          const user = result.rows[0];
          this.connectedUsers.push(user); // Add user to the list of connected users
          this.server.emit('users_list', this.connectedUsers); // Broadcast the updated user list
        }
      } catch (err) {
        console.error('Invalid token:', err);
      }
    } else {
      console.log('No token provided');
    }
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const authHeaderToken = client.handshake.headers.authorization;
    if (authHeaderToken) {
      const token = authHeaderToken.split(' ')[1];
      try {
        const decoded: any = jwt.verify(token, process.env.ACCESS_SECRET);
        const userId = decoded.userId;
        this.connectedUsers = this.connectedUsers.filter(user => user.id !== userId); // Remove user from the list
        this.server.emit('users_list', this.connectedUsers); // Broadcast the updated user list
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }

  @SubscribeMessage('request_users_list')
  handleRequestUsersList(client: Socket) {
    client.emit('users_list', this.connectedUsers);
  }

  @SubscribeMessage('send_message')
  async handleMessage(client: Socket, message: { curUsername: string, content: string }) {
    const timestamp = new Date().toISOString();
    try {
      // Save the message to the database
      const savedMessage = await this.chatService.sendGlobalMessage(message.curUsername, message.content);
      
      // Emit the message to all connected clients
      this.server.emit('receive_message', { ...savedMessage, timestamp });
    } catch (error) {
      console.error('Error while sending message:', error);
    }
  }

  @SubscribeMessage('send_private_message')
  handlePrivateMessage(client: Socket, message: { chatRoomId: number, curUsername: string, content: string }) {
    const timestamp = new Date().toISOString();
    console.log(`Sending private message to room ${message.chatRoomId}: ${message.content}, by user: ${message.curUsername}`);
    this.server.to(`room_${message.chatRoomId}`).emit('receive_private_message', { ...message, timestamp });
  }

  @SubscribeMessage('join_chat_room')
  handleJoinChatRoom(client: Socket, chatRoomId: number) {
    client.join(`room_${chatRoomId}`);
    console.log(`Client joined chat room: room_${chatRoomId}`);
  }
}
