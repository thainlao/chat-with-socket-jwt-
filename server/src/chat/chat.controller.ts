import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ChatService } from './chat.service';

@Controller('chat-rooms')
export class ChatRoomController {
  constructor(private readonly chatService: ChatService) {}

  @Post('createroom')
  async createChatRoom(@Body('userIds') userIds: number[]) {
      return this.chatService.createChatRoom(userIds);
  }

  @Post('getchatroom')
  async getChatRoomsForUsers(@Body('userIds') userIds: number[]) {
    return this.chatService.getChatRoomsForUsers(userIds);
  }

  @Post('sendmessage')
  async sendMessage(
    @Body('chatRoomId') chatRoomId: number,
    @Body('curUsername') curUsername: string,
    @Body('content') content: string,
  ) {
    return this.chatService.sendMessage(chatRoomId, curUsername, content);
  }

  @Get('messages/:chatRoomId')
  async getMessages(@Param('chatRoomId') chatRoomId: number) {
    return this.chatService.getMessages(chatRoomId);
  }

  @Post('sendglobalmessage')
  async sendGlobalMessage(
    @Body('curUsername') curUsername: string,
    @Body('content') content: string,
  ) {
    return this.chatService.sendGlobalMessage(curUsername, content);
  }

  @Get('globalmessages')
  async getGlobalMessages() {
    return this.chatService.getGlobalMessages();
  }
}