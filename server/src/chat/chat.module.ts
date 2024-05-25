import { Module } from "@nestjs/common";
import { ChatRoomController } from "./chat.controller";
import { ChatService } from "./chat.service";

@Module({
    controllers: [ChatRoomController],
    providers: [ChatService],
    imports: [],
})

export class chatModule {}