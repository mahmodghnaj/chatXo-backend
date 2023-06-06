import { Controller, Get, Body, Patch, Req, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * Update a user.
   * @param updateUserDto - Updated user data.
   * @param req - Request object containing user information.
   * @returns The updated user.
   */
  @Patch()
  update(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    return this.usersService.update(req.user.id, updateUserDto);
  }

  /**
   * Search for users based on the provided query.
   * @param query - Search query.
   * @param req - Request object containing user information.
   * @returns An object containing the search result.
   */
  @Get('/search')
  async searchUsers(@Query('name') query: string, @Req() req) {
    const users = await this.usersService.searchUsers(query, req.user.id);
    return users;
  }
}
