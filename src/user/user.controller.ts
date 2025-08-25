import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserRequestDTO } from './dto/user-request.dto';
import { UserResponseDTO } from './dto/user-response.dto';
import { User } from './user.entity';
import { UserUpdateDTO } from './dto/user-update.dto';
import { SkipAuth } from 'src/common/decorators/public.decorator';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @SkipAuth()
  @Post('create')
  async createUser(
    @Body() userDTO: UserRequestDTO,
  ): Promise<UserResponseDTO | null> {
    return await this.userService.createUser(userDTO);
  }

  @Get('all')
  async getAllUsers(): Promise<User[]> {
    return await this.userService.findAll();
  }

  @Get(':email')
  getUserByEmail(@Param('email') email: string): Promise<User | null> {
    return this.userService.findUserByEmail(email);
  }
  @Get(':id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<User | null> {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUser: UserUpdateDTO,
  ): Promise<UserResponseDTO> {
    return this.userService.updateUser(id, updateUser);
  }

  @Delete('delete/:id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.removeUser(id);
  }
}
