import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  Post,
  Req,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { Public } from 'src/decorators/public';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guard/local-auth.guard';
import { RefreshTokenGuard } from './guard/refresh-token.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  private cleanUrl(domain) {
    const removeProtocolFromURL = domain.replace(/^(https?:\/\/)?/, '');
    const lastDotIndex = removeProtocolFromURL.lastIndexOf('.');
    if (lastDotIndex !== -1) {
      return removeProtocolFromURL.substring(0, lastDotIndex);
    }
    return removeProtocolFromURL;
  }
  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      // sameSite: 'none',
      // secure: true,
      domain: 'localhost', // just backend and frontend  different domains
    });
  }
  @Public()
  @Post('register')
  async register(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await await this.authService.register(body);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return tokens;
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(req.user);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return tokens;
  }

  @Public()
  @UseGuards(RefreshTokenGuard)
  @Post('refresh-token')
  async refreshToken(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await this.authService.refreshToken(
      req.user.id,
      req.user.refreshToken,
    );
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    return tokens;
  }
  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {}

  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubLoginCallback(@Req() req, @Res() res) {
    return res.redirect(
      `${process.env.CLIENT_URL}/social?token=${req.user.accessToken}&refreshToken=${req.user.refreshToken}`,
    );
  }
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res) {
    return res.redirect(
      `${process.env.CLIENT_URL}/social?token=${req.user.accessToken}&refreshToken=${req.user.refreshToken}`,
    );
  }

  @Public()
  @UseGuards(AuthGuard('session'))
  @Get('session')
  async session(@Request() req) {
    const accessToken = await this.authService.verifyAccessToken(
      req.user.accessToken,
    );
    if (!accessToken) throw new HttpException('Unauthorized', 403);
    const user = await this.authService.me(req.user.id);
    return {
      user,
      refreshToken: req.cookies.refreshToken,
      accessToken: req.user.accessToken,
    };
  }

  @Get('me')
  async me(@Request() re) {
    return await this.authService.me(re.user.id);
  }
}
