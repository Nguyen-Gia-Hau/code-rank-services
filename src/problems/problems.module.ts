import { forwardRef, Module } from '@nestjs/common';
import { ProblemsService } from './problems.service';
import { ProblemsController } from './problems.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity';
import { ProblemType } from 'src/problem-types/entities/problem-type.entity';
import { AuthModule } from 'src/auth/auth.module';
import { Testcase } from 'src/testcases/entities/testcase.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Problem, ProblemType, Testcase]),
    forwardRef(() => AuthModule)
  ],
  controllers: [ProblemsController],
  providers: [ProblemsService],
  exports: [ProblemsService]
})
export class ProblemsModule { }
