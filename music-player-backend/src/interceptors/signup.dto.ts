import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @IsString()
  @IsEmail({}, { message: "Email is not valid" })
  email: string;

  @IsString()
  @MinLength(3, { message: "Your username is too short" })
  username: string;

  @IsString()
  @MinLength(8, { message: "Your password is too short" })
  password: string;
}
