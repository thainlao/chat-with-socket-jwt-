import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { WsGateway } from './chat/socket.service';
import { ChatRoomController } from './chat/chat.controller';
import { ChatService } from './chat/chat.service';
import { chatModule } from './chat/chat.module';

@Module({
  imports: [UsersModule, AuthModule, chatModule, ConfigModule.forRoot()],
  controllers: [ChatRoomController],
  providers: [WsGateway, ChatService],
})
export class AppModule {}
