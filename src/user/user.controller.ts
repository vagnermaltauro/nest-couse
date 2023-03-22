import { UserService } from './user.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { Body, Controller, Post, Get, Param, Put, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { UpdatePutUserDTO } from './dto/update-put-user.dto';
import { UpdatePatchUserDTO } from './dto/update-patch-user.dto';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDTO) {
    return await this.userService.create(data);
  }

  @Get()
  async list() {
    return this.userService.list();
  }

  @Get(':id')
  async readOne(@Param('id', ParseIntPipe) id: number) {
    return { user: {}, id };
  }

  @Put(':id')
  async update(@Body() {email, name, password}: UpdatePutUserDTO, @Param('id', ParseIntPipe) id: number) {
    return {
      method: 'put',
      email, name, password,
      id
    };
  }

  @Patch(':id')
  async updatePartial(@Body() {email, name, password}: UpdatePatchUserDTO, @Param('id', ParseIntPipe) id: number) {
    return {
      method: 'patch',
      email, name, password,
      id
    };
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return {
      id
    };
  }
}
