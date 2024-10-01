
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 255) // Độ dài tối thiểu cho mật khẩu
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 45) // Độ dài tối đa cho username
  username: string;
}

