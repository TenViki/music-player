import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { User } from "src/entities/user.entity";
import { AuthGuard } from "src/guards/auth.guard";
import { LoginDto } from "src/interceptors/login.dto";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { RegisterDto } from "src/interceptors/signup.dto";
import { AuthService } from "./auth.service";
import { CurrentUser } from "./middleware/current-user.middleware";
import { UserDto } from "./user.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  @Serialize(UserDto)
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post("signup")
  @Serialize(UserDto)
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

  @Get("me")
  @Serialize(UserDto)
  @UseGuards(AuthGuard)
  me(@CurrentUser() user: User) {
    return user;
  }
}
