import { Module } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ProblemsController } from './problems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity';
import { ProblemType } from 'src/problem-types/entities/problem-type.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Problem, ProblemType])
  ],
  controllers: [ProblemsController],
  providers: [ProblemsService],
})
export class ProblemsModule { }
