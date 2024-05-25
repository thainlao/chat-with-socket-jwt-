import { Client } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config();

const client = new Client({
    user: process.env.USERNAME_db,
    password: process.env.PASSWORD,
    host: process.env.HOST,
    port: parseInt(process.env.DB_PORT),
    database: process.env.BASE_NAME,
});

client.connect();

export default client;