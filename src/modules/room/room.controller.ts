import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { OnlyIDParamDTO } from 'src/dto/is-mongoose-id';
import { CreatedRoomDto } from './dto/add-room.dto';
import { RoomService } from './room.service';
import { RoomDocument } from './schemas/room.schema';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}
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
  @Get()
  getRooms(@Query() pagination, @Req() req) {
    return this.roomService.getRooms(pagination, req.user.id);
  }
  @Get(':id')
  getMessagesChat(@Param() params: OnlyIDParamDTO, @Query() pagination) {
    return this.roomService.getMessagesChat(params.id, pagination);
  }
  @Delete(':id')
  deleteRooms() {}
}
