import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import mariaDBConfig from './Configuration/mariaDB.config';
import { ConfigModule } from '@nestjs/config';
import { LanguagesModule } from './languages/languages.module';
import { ProblemsModule } from './problems/problems.module';
import { TestcasesModule } from './testcases/testcases.module';
import { ProblemTypesModule } from './problem-types/problem-types.module';
import { SubmissionsModule } from './submissions/submissions.module';
import { CodeRunnerService } from './code-runner/code-runner.service';
import { ContestsModule } from './contests/contests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [mariaDBConfig],
      isGlobal: true
    }),
    TypeOrmModule.forRoot(mariaDBConfig()
    ),
    AuthModule,
    UsersModule,
    LanguagesModule,
    ProblemsModule,
    TestcasesModule,
    ProblemTypesModule,
    SubmissionsModule,
    ContestsModule
  ],
  controllers: [AppController],
  providers: [AppService, CodeRunnerService],
})
export class AppModule { }
