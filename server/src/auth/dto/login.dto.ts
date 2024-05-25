export class LoginDto {
    password: string;
    username: string;
}

export class RegisterDto {
    username: string;
    password: string;
}

export class RefreshTokenDto {
    refreshToken: string;
}