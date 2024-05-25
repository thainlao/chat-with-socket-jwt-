React + Nest JS + Docker + TypeScript + PosgreSQL +  Vite;

to Start
1) git clone https://github.com/thainlao/chat-with-socket-jwt-/tree/main
2) cd server/ npm i/ npm run start:dev
3) cd client/ npm i/ npm run dev

Функциональность:

1)После регистрации или логина появлятся JWT токен
2)Вы сразу попадаете в глобальный чат подключаясь по WS, каждый пользователь отслеживается, каждое сообщение сохраняется в базу данных
3)При нажатии (создать чат)
![image](https://github.com/thainlao/chat-with-socket-jwt-/assets/121868297/8c5da347-e168-4008-a231-74c04ace0f0d)
Проверяется на сервере существует ли уже чат с данными пользователями, если да, то выкидывает на клиент ошибку
При успешном создании создается чат в разделе My Chats
4) Каждое сообщение отправленное в личном чате также сохраняется в бд и подгружается для пользователей которые перезагрузили страницу


![image](https://github.com/thainlao/chat-with-socket-jwt-/assets/121868297/fb13e3df-24ef-4b2b-81da-050618d34b36)
