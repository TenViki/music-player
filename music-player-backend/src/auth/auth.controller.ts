import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "src/interceptors/login.dto";
import { Serialize } from "src/interceptors/serialize.interceptor";
import { RegisterDto } from "src/interceptors/signup.dto";
import { AuthService } from "./auth.service";
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
}
