import { Controller, Get, Post, Body, Patch, Param, Delete, Req, HttpException, NotFoundException } from '@nestjs/common';
import { UsersService } from '../services/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }
  @Get(':username/profile')
  getProfile(@Param('username') username: string) {
    const user = this.usersService.findOne({ username: username });
    if (!user) throw new NotFoundException()
    return user
  }
  @Get()
  findAll() {
    return this.usersService.findAll();
  }
}
