import { HttpException, Injectable } from '@nestjs/common';
import RefreshToken from './entities/refresh-token.entity';
import { User } from 'src/users/entities/user.entity';
import { sign, verify } from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    private refreshToken: RefreshToken[] = [];
    constructor(private readonly userSerivce: UsersService) {}

    async refresh(refreshStr: string): Promise<string | undefined>{
        const refreshToken = await this.retrieveRefreshToken(refreshStr);
        if (!refreshToken) {
            return undefined
        }

        const user = await this.userSerivce.findById(refreshToken.userId);
        if (!user) {
            return undefined
        }

        const accessToken = {
            userId: refreshToken.userId,
        }

        return sign(accessToken, process.env.ACCESS_SECRET, { expiresIn: '24h' });
    }

    private retrieveRefreshToken(refreshStr: string): Promise<RefreshToken | undefined>{
        try {
            const decoded = verify(refreshStr, process.env.REFRESH_TOKEN);
            if (typeof decoded === 'string') {
                return undefined
            }
            return Promise.resolve(
                this.refreshToken.find((token: RefreshToken) => token.id === decoded.id)
            )
        } catch (e) {
            return undefined
        } 
    }

    async login(
        username: string,
        password: string,
    ): Promise<{ accessToken: string; refreshToken: string} | undefined>{
        const user = await this.userSerivce.findByUsername(username);
        if (!user) {
            return undefined
        }

        if (user.password !== password) {
            return undefined
        }

        return this.newRefreshAndAccessToken(user);
    }

    private async newRefreshAndAccessToken(
        user: User
    ): Promise<{ accessToken: string; refreshToken: string}>{
        const refreshObject = new RefreshToken({
            id:
                this.refreshToken.length === 0
                ? 0
                : this.refreshToken[this.refreshToken.length - 1].id + 1,
                userId: user.id,
        });
        this.refreshToken.push(refreshObject);
        return {
            refreshToken: refreshObject.sign(),
            accessToken: sign({
                userId: user.id
            },process.env.ACCESS_SECRET, {
                expiresIn: '24h',
            })
        }
    }

    async logout(refreshStr: string): Promise<void>{
        const refreshToken = await this.retrieveRefreshToken(refreshStr);

        if (!refreshToken) {
            return;
        }
        this.refreshToken = this.refreshToken.filter(
            (refreshToken: RefreshToken) => refreshToken.id !== refreshToken.id,
        )
    }

    async registration(username: string, password: string): Promise<string | undefined> {
        try {
            const newUser = await this.userSerivce.create(username, password);
            const accessToken = sign({ userId: newUser.id }, process.env.ACCESS_SECRET, { expiresIn: '24h' });
            return accessToken;
        } catch(e) {
            console.log(e)
        }
    }
}
