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
  @Get('/message/:id')
  getMessagesChat(@Param() params: OnlyIDParamDTO, @Query() pagination) {
    return this.roomService.getMessagesChat(params.id, pagination);
  }
  @Get(':id')
  getById(@Param() params: OnlyIDParamDTO, @Req() req) {
    return this.roomService.findOne(params.id, req.user.id);
  }
  @Delete()
  deleteRooms(@Req() req) {
    return this.roomService.deleteRoomsAndMessagesByUserId(req.user.id);
  }
  @Get('/check/:id') //friend Id
  checkRoom(@Param() params: OnlyIDParamDTO, @Req() req) {
    return this.roomService.checkRoom(params.id, req.user.id);
  }
  @Delete(':id')
  deleteRoom(@Param() params: OnlyIDParamDTO) {
    return this.roomService.deleteById(params.id);
  }
}
