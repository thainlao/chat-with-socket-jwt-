export interface IUser{
    id: number;
    username: string;
    password: string;
}

export interface IUserChats {
    chat_room_id: number;
    user_ids: number[];
    created_at: string;
}

export interface IMessage {
    message_id: number;
    content: string;
    timestamp: any;
    curUsername: string;
}