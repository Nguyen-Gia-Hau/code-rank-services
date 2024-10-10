import { forwardRef, Module } from '@nestjs/common';
import { ContestsService } from './contests.service';
import { ContestsController } from './contests.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contest } from './entities/contest.entity';
import { ContestUser } from './entities/contest-user.entity';
import { ContestProblem } from './entities/contest-problem.entity';
import { User } from 'src/users/entities/user.entity';
import { Problem } from 'src/problems/entities/problem.entity';
import { ProblemsModule } from 'src/problems/problems.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Contest, ContestUser, ContestProblem, User, Problem]),
    ProblemsModule,
    UsersModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [ContestsController],
  providers: [ContestsService],
  exports: [ContestsService]
})
export class ContestsModule { }
