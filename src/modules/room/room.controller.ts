import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { OnlyIDParamDTO } from 'src/dto/is-mongoose-id';
import { CreatedRoomDto } from './dto/add-room.dto';
import { RoomService } from './room.service';
import { RoomDocument } from './schemas/room.schema';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  /**
   * Create a new room.
   * @param createRoomDto - The DTO containing the necessary data to create the room.
   * @param req - The request object containing user information.
   * @returns A Promise resolving to the created room document.
   */
  @Post()
  addRoom(
    @Body() createRoomDto: CreatedRoomDto,
    @Req() req,
  ): Promise<RoomDocument> {
    const body = {
      user1: req.user.id,
      user2: createRoomDto.user,
    };
    return this.roomService.createRoom(body);
  }

  /**
   * Get paginated rooms for the current user.
   * @param pagination - The pagination parameters.
   * @param req - The request object containing user information.
   * @returns The paginated list of rooms.
   */
  @Get()
  getRooms(@Query() pagination, @Req() req) {
    return this.roomService.getRooms(pagination, req.user.id);
  }

  /**
   * Get paginated messages for a specific room.
   * @param params - The route parameters containing the room ID.
   * @param pagination - The pagination parameters.
   * @returns The paginated list of messages in the room.
   */
  @Get('/message/:id')
  getMessagesChat(@Param() params: OnlyIDParamDTO, @Query() pagination) {
    return this.roomService.getMessagesChat(params.id, pagination);
  }

  /**
   * Get a specific room by its ID.
   * @param params - The route parameters containing the room ID.
   * @param req - The request object containing user information.
   * @returns The room information.
   */
  @Get(':id')
  getById(@Param() params: OnlyIDParamDTO, @Req() req) {
    return this.roomService.findOne(params.id, req.user.id);
  }

  /**
   * Check if a room exists between the current user and a friend.
   * @param params - The route parameters containing the friend's ID.
   * @param req - The request object containing user information.
   * @returns The room information if found, or null if not found.
   */
  @Get('/check/:id') //friend Id
  checkRoom(@Param() params: OnlyIDParamDTO, @Req() req) {
    return this.roomService.checkRoom(params.id, req.user.id);
  }

  /**
   * Delete a specific room by its ID.
   * @param params - The route parameters containing the room ID.
   * @returns A Promise resolving to 'ok' when the operation is completed.
   */
  @Delete(':id')
  deleteRoom(@Param() params: OnlyIDParamDTO) {
    return this.roomService.deleteById(params.id);
  }
}
