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
import { UserDocument } from '../users/schemas/user.schema';

/**
 * AuthController handles authentication-related endpoints such as registration, login, token refreshing, and social login via GitHub and Google.
 * It uses various guards for authentication and access control.
 */
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {}
  /**
   * Sets the refresh token cookie in the response.
   * @param res The HTTP response object.
   * @param refreshToken The refresh token value.
   */
  // Because of domain backend different domain frontend can see you this issus  =>
  /**
  https://stackoverflow.com/questions/62749492/set-cookie-was-blocked-because-its-domain-attribute-was-invalid-with-regards-to
  */

  //where domain frontend same domain backend
  private setRefreshTokenCookie(res: Response, refreshToken: string) {
    // res.cookie('refresh', refreshToken, {
    //   httpOnly: true,
    //   maxAge: Number(process.env.EXPIRES_RF_TOKEN),
    //   sameSite: 'none',
    //   secure: true,
    // });
  }

  /**
   * Endpoint for user registration.
   * @param body The request body containing user registration data.
   * @param res The HTTP response object.
   * @returns The authentication tokens for the registered user.
   */
  @Public()
  @Post('register')
  async register(
    @Body() body: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokens = await await this.authService.register(body);
    // this.setRefreshTokenCookie(res, tokens.refreshToken); don't use please write commit in line 38
    return tokens;
  }

  /**
   * Endpoint for user login.
   * @param req The HTTP request object containing user login data.
   * @param res The HTTP response object.
   * @returns The authentication tokens for the logged-in user.
   */
  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(200)
  async login(@Request() req, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(req.user);
    // this.setRefreshTokenCookie(res, tokens.refreshToken); don't use please write commit in line 38
    return tokens;
  }

  /**
   * Endpoint for refreshing the access token using a refresh token.
   * @param req The HTTP request object containing the user ID and refresh token.
   * @param res The HTTP response object.
   * @returns The new authentication tokens.
   */
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
    //this.setRefreshTokenCookie(res, tokens.refreshToken); //don't use please write commit in line 38
    return tokens;
  }

  /**
   * Endpoint for initiating GitHub login.
   * Uses the GitHub authentication guard.
   */
  @Public()
  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubLogin() {}

  /**
   * Callback endpoint for GitHub login.
   * Uses the GitHub authentication guard.
   * @param req The HTTP request object containing the user data from GitHub.
   * @param res The HTTP response object.
   * @returns Redirects to the frontend with the access token and refresh token as query parameters.
   */
  @Public()
  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubLoginCallback(@Req() req, @Res() res) {
    return res.redirect(
      `${process.env.CLIENT_URL}/social?token=${req.user.accessToken}&refreshToken=${req.user.refreshToken}`,
    );
  }

  /**
   * Endpoint for initiating Google login.
   * Uses the Google authentication guard.
   */
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  /**
   * Callback endpoint for Google login.
   * Uses the Google authentication guard.
   * @param req The HTTP request object containing the user data from Google.
   * @param res The HTTP response object.
   * @returns Redirects to the frontend with the access token and refresh token as query parameters.
   */
  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res) {
    return res.redirect(
      `${process.env.CLIENT_URL}/social?token=${req.user.accessToken}&refreshToken=${req.user.refreshToken}`,
    );
  }

  /**
   * Endpoint for retrieving session information.
   * Uses the session authentication guard.
   * @param req The HTTP request object.
   * @returns The user information and authentication tokens.
   */
  @Public()
  @UseGuards(AuthGuard('session'))
  @Get('info-session')
  async session(@Request() req) {
    //where domain frontend difference domain backend
    const authorizationHeader = req.headers.authorization;
    const refreshToken = authorizationHeader.split(' ')[1];
    //
    const accessToken = await this.authService.verifyAccessToken(
      req.user.accessToken,
    );
    if (!accessToken) throw new HttpException('Unauthorized', 401);
    const user = await this.authService.me(req.user.id);
    return {
      user,
      //  refreshToken: req.cookies.refresh, //don't use please write commit in line 38
      refreshToken,
      accessToken: req.user.accessToken,
    };
  }

  /**
   * Endpoint for retrieving the currently authenticated user's information.
   * @param req The HTTP request object.
   * @returns The user information.
   */
  @Get('me')
  async me(@Request() re): Promise<UserDocument> {
    return await this.authService.me(re.user.id);
  }

  @Get('logout')
  async logout(@Request() re, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('refresh');
    return await this.authService.logout(re.user.id);
  }
}
