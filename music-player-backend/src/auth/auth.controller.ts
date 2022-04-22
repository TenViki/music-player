import { Body, Controller, Post } from "@nestjs/common";
import { LoginDto } from "src/interceptors/login.dto";
import { RegisterDto } from "src/interceptors/signup.dto";
import { AuthService } from "./auth.service";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("login")
  login(@Body() data: LoginDto) {
    return this.authService.login(data);
  }

  @Post("signup")
  register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }
}
