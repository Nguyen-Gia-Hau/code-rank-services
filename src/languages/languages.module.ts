import { forwardRef, Module } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { LanguagesController } from './languages.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Language } from './entities/language.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Language]),
    forwardRef(() => AuthModule)
  ],
  controllers: [LanguagesController],
  providers: [LanguagesService],
})
export class LanguagesModule { }
