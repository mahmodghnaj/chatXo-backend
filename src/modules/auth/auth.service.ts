import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UsersService } from 'src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDocument } from '../users/schemas/user.schema';

export type InfoToken = {
  accessToken: string;
  refreshToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  // Verifies the access token
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

  // Registers a new user
  async register(body: CreateUserDto): Promise<InfoToken> {
    const user = await this.usersService.create(body);
    return await this.getToken(user);
  }

  // Logs in a user
  async login(user: UserDocument): Promise<InfoToken> {
    return await this.getToken(user);
  }

  // Refreshes the access token
  async refreshToken(id: string, rt: string): Promise<InfoToken> {
    const user = await this.usersService.validateUser({ _id: id });
    if (user.refreshToken != rt) {
      throw new HttpException('Unauthorized', 401);
    }
    return await this.getToken(user);
  }

  // Validates user credentials
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

  // Retrieves the user information
  async me(id): Promise<UserDocument> {
    const user = this.usersService.findOne({ _id: id });
    return user;
  }

  // Validates social login and returns tokens
  async validateSocialLogin(
    profile: any,
    socialType: string,
  ): Promise<InfoToken> {
    const { id, login, email, sub, name, family_name } = profile._json; // all info returned from Social Login
    let user = await this.usersService.findOne({
      socialId: id || sub,
      socialType: socialType,
    });

    if (!user) {
      user = await this.usersService.create({
        socialId: id || sub,
        socialType: socialType,
        firstName: login || name,
        lastName: family_name,
        email: email,
        password: '',
      });
    }
    return this.getToken(user);
  }

  // Generates access and refresh tokens
  async getToken(infoUser: UserDocument): Promise<InfoToken> {
    const { id, email, firstName, lastName } = infoUser;
    const payload = { id, email, firstName, lastName };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: process.env.SECRET,
      expiresIn: Number(process.env.EXPIRES_TOKEN),
    });

    const refreshToken = await this.jwtService.signAsync(
      { ...payload, accessToken },
      {
        secret: process.env.REFRESH_TOKEN_SECRET,
        expiresIn: Number(process.env.EXPIRES_RF_TOKEN),
      },
    );

    await this.usersService.update(payload.id, {
      refreshToken: refreshToken,
    });

    return {
      accessToken,
      refreshToken,
    };
  }

  async logout(id) {
    await this.usersService.update(id, {
      refreshToken: null,
    });
    return 'ok';
  }
}
