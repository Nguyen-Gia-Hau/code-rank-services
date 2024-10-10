import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { ContestsService } from './contests.service';
import { CreateContestDto } from './dto/create-contest.dto';
import { UpdateContestDto } from './dto/update-contest.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.decorator';
import { CreateContestProblemDto } from './dto/create-contest-problem.dto';
import { CreateContestUserDto } from './dto/create-contest-user.dto';

@Controller('contests')
export class ContestsController {
  constructor(private readonly contestsService: ContestsService) { }

  @UseGuards(AuthGuard)
  @Role('admin')
  @Post()
  create(@Body() createContestDto: CreateContestDto) {
    return this.contestsService.create(createContestDto);
  }

  @UseGuards(AuthGuard)
  @Role('admin')
  @Post('/problems')
  createContestProblem(@Body() createContestProblemDto: CreateContestProblemDto) {
    return this.contestsService.createContestProblem(createContestProblemDto);
  }

  @UseGuards(AuthGuard)
  @Post('/users')
  createContestUser(@Req() req, @Body() createContestUserDto: CreateContestUserDto) {
    createContestUserDto.user_id = req.user_id
    return this.contestsService.createContestUser(createContestUserDto);
  }
  @Get()
  findAll() {
    return this.contestsService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.contestsService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContestDto: UpdateContestDto) {
    return this.contestsService.update(+id, updateContestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.contestsService.remove(+id);
  }
}
