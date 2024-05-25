import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  me(@Req() req){
    const userId = req.user.userId;
    return this.usersService.findById(userId)
  }

  @Post('/chat-users')
  async findAllChatUsers(@Req() req): Promise<User[]> {
    const userIds = req.body.ids;
    const chatUsers = await this.usersService.findAllChatUsers(userIds);
    return chatUsers;
  }
}
