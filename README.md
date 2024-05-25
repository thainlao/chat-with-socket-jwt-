React + Nest JS + Docker + TypeScript + PosgreSQL +  Vite;

to Start
1) cd server/ npm i/ npm run start:dev
2) cd client/ npm i/ npm run dev

Функциональность:

1)После регистрации или логина появлятся JWT токен
2)Вы сразу попадаете в глобальный чат подключаясь по WS, каждый пользователь отслеживается, каждое сообщение сохраняется в базу данных
3)При нажатии (создать чат)
![image](https://github.com/thainlao/chat-with-socket-jwt-/assets/121868297/8c5da347-e168-4008-a231-74c04ace0f0d)
Проверяется на сервере существует ли уже чат с данными пользователями, если да, то выкидывает на клиент ошибку
При успешном создании создается чат в разделе My Chats
4) Каждое сообщение отправленное в личном чате также сохраняется в бд и подгружается для пользователей которые перезагрузили страницу


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    password TEXT NOT NULL,
);

CREATE TABLE chat_room_users (
    chat_room_id SERIAL PRIMARY KEY,
    user_ids INTEGER[],
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    message_id SERIAL PRIMARY KEY,
    chat_room_id INTEGER NOT NULL REFERENCES chat_room_users(chat_room_id) ON DELETE CASCADE,
    curusername INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE global_messages (
    message_id SERIAL PRIMARY KEY,
    curusername INTEGER NOT NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
