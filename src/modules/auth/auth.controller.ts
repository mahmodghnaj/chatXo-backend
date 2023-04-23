import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Public } from 'src/decorators/public';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RefreshTokenGuard } from './guard/refresh-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Public()
  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return await this.authService.register(body);
  }
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh-token')
  async refreshToken(@Request() req) {
    return await this.authService.refreshToken(
      req.user.id,
      req.user.refreshToken,
    );
  }
  @Get('me')
  async me(@Request() re) {
    return await this.authService.me(re.user.id);
  }
}
