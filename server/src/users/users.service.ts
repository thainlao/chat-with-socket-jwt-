import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { User } from './entities/user.entity';
import client from '../../db';

@Injectable()
export class UsersService {
    async findByUsername(username: string): Promise<User | undefined> {
        try {
            const query = 'SELECT * FROM users WHERE username = $1';
            const result = await client.query(query, [username]);
            const user = result.rows[0]; // Предполагается, что результатом будет только один пользователь
            return user;
        } catch (error) {
            console.error('Error while fetching user by username:', error);
            return undefined;
        }
    }

    async findById(id: number): Promise<User | undefined> {
        try {
            const query = 'SELECT * FROM users WHERE id = $1';
            const result = await client.query(query, [id]);
            const user = result.rows[0]; // Expecting a single user as the result
            return user;
        } catch (error) {
            console.error('Error while fetching user by id:', error);
            return undefined;
        }
    }

    async create(username: string, password: string): Promise<User> {
        try {
            // Проверка существующего пользователя по username
            let query = 'SELECT * FROM users WHERE username = $1';
            let result = await client.query(query, [username]);
            if (result.rows.length > 0) {
                throw new ConflictException('Username is already taken');
            }

            // Вставляем нового пользователя в базу данных
            query = 'INSERT INTO users(username, password) VALUES($1, $2) RETURNING *';
            result = await client.query(query, [username, password]);
            const createdUser = result.rows[0];
            return createdUser;
        } catch (error) {
            console.error('Error while creating user:', error.message);
            if (error instanceof ConflictException) {
                throw error;
            } else {
                throw new InternalServerErrorException('Internal Server Error');
            }
        }
    }

    async findAllChatUsers(ids: number[]): Promise<User[]> {
        try {
          const query = `SELECT * FROM users WHERE id IN (${ids.map((_, index) => `$${index + 1}`).join(', ')})`;
          const result = await client.query(query, ids);
          const users = result.rows;
          return users;
        } catch (error) {
          console.error('Error while fetching users by ids:', error);
        }
    }
}