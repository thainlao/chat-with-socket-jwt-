import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import pgClient from '../../db';

@Injectable()
export class ChatService {
  async createChatRoom(userIds: number[]) {
    try {
      // Сортируем и форматируем массив для удобства сравнения
      const sortedUserIds = userIds.slice().sort((a, b) => a - b);

      // Проверяем наличие существующей записи
      const queryCheck = `
        SELECT chat_room_id
        FROM chat_room_users
        WHERE user_ids @> $1::int[] AND array_length(user_ids, 1) = $2
      `;
      const resultCheck = await pgClient.query(queryCheck, [sortedUserIds, sortedUserIds.length]);

      if (resultCheck.rows.length > 0) {
        return { success: false };
      }

      // Вставляем новую запись
      const queryInsert = `
        INSERT INTO chat_room_users (user_ids)
        VALUES ($1)
        RETURNING chat_room_id
      `;
      await pgClient.query(queryInsert, [sortedUserIds]);

      return { success: true };
    } catch (error) {
      console.error('Error while creating chat room:', error);
      throw new Error('Could not create chat room');
    }
  }

  async getChatRoomsForUsers(userIds: number[]) {
    try {
      const query = `
        SELECT chat_room_id, user_ids, created_at
        FROM chat_room_users
        WHERE user_ids && $1::int[]
      `;
      const result = await pgClient.query(query, [userIds]);
  
      if (result.rows.length === 0) {
        throw new NotFoundException('No chat rooms found for these users');
      }
  
      return result.rows;
    } catch (error) {
      console.error('Error while retrieving chat rooms:', error);
      throw new Error('Could not retrieve chat rooms');
    }
  }

  async sendMessage(chatRoomId: number, curUsername: string, content: string) {
    try {
      const queryInsertMessage = `
        INSERT INTO messages (chat_room_id, curUsername, content, timestamp)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      const timestamp = new Date().toISOString();
      const result = await pgClient.query(queryInsertMessage, [chatRoomId, curUsername, content, timestamp]);

      if (result.rows.length === 0) {
        throw new NotFoundException('Message not saved');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error while sending message:', error);
      throw new Error('Could not send message');
    }
  }

  async getMessages(chatRoomId: number) {
    try {
      const queryGetMessages = `
        SELECT * FROM messages
        WHERE chat_room_id = $1
        ORDER BY timestamp ASC
      `;
      const result = await pgClient.query(queryGetMessages, [chatRoomId]);

      if (result.rows.length === 0) {
        throw new NotFoundException('No messages found for this chat room');
      }

      return result.rows;
    } catch (e) {
      console.log(e)
    }
  }

  async sendGlobalMessage(curUsername: string, content: string) {
    try {
      const queryInsertMessage = `
        INSERT INTO global_messages (curUsername, content, timestamp)
        VALUES ($1, $2, $3)
        RETURNING *
      `;
      const timestamp = new Date().toISOString();
      const result = await pgClient.query(queryInsertMessage, [curUsername, content, timestamp]);

      if (result.rows.length === 0) {
        throw new NotFoundException('Global message not saved');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error while sending global message:', error);
      throw new Error('Could not send global message');
    }
  }

  async getGlobalMessages() {
    try {
      const queryGetMessages = `
        SELECT * FROM global_messages
        ORDER BY timestamp ASC
      `;
      const result = await pgClient.query(queryGetMessages);

      if (result.rows.length === 0) {
        throw new NotFoundException('No global messages found');
      }

      return result.rows;
    } catch (e) {
      console.log(e);
      throw new Error('Could not retrieve global messages');
    }
  }
}