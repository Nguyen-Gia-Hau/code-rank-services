import { forwardRef, Module } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ProblemsController } from './problems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity';
import { ProblemType } from 'src/problem-types/entities/problem-type.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Problem, ProblemType]),
    forwardRef(() => AuthModule)
  ],
  controllers: [ProblemsController],
  providers: [ProblemsService],
})
export class ProblemsModule { }
