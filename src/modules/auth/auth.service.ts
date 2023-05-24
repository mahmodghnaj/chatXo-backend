import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../users/schemas/user.schema';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  verifyAccessToken(accessToken: string) {
    try {
      const payload = this.jwtService.verify(accessToken, {
        secret: process.env.SECRET,
      });

      return payload;
    } catch (err) {
      return null;
    }
  }
  async register(body: CreateUserDto) {
    const user = await this.usersService.create(body);
    return await this.getToken(user);
  }
  async login(body) {
    return await this.getToken(body);
  }
  async refreshToken(id, rt) {
    const user = await this.usersService.validateUser({ _id: id });
    if (user.refreshToken != rt) {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.getToken(user);
  }
  async validate(body) {
    const user = await this.usersService.validateUser({
      email: body.email,
    });
    let isMatch: boolean;
    if (user) {
      isMatch = await bcrypt.compare(body.password, user?.password);
    }
    if (user && isMatch) {
      return {
        id: user.id,
      };
    }
    return null;
  }
  async me(id): Promise<CreateUserDto> {
    const user = this.usersService.findOne({ _id: id });
    return user;
  }
  async getToken(infoUser: UserDocument) {
    const { id, email, firstName, lastName } = infoUser;
    const payload = { id, email, firstName, lastName };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.SECRET,
        expiresIn: Number(process.env.EXPIRES_TOKEN),
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: Number(process.env.EXPIRES_RF_TOKEN),
      }),
    ]);
    await this.usersService.update(payload.id, {
      refreshToken: refreshToken,
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
