import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SignInAuthDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  password: string;
}
