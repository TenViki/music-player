import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/entities/user.entity";
import { LoginDto } from "src/interceptors/login.dto";
import { Repository } from "typeorm";
import * as bc from "bcrypt";
import { RegisterDto } from "src/interceptors/signup.dto";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async login(loginDto: LoginDto) {
    const user = await this.repo.findOne({
      where: { email: loginDto.email },
    });
    if (!user) throw new NotFoundException("User not found");

    const isPasswordValid = await bc.compare(loginDto.password, user.password);
    if (!isPasswordValid)
      throw new BadRequestException("Password does not match");

    return { ...user, token: this.createToken(user) };
  }

  async register(regDto: RegisterDto) {
    const user = await this.repo.findOne({
      where: { email: regDto.email },
    });
    if (user) throw new BadRequestException("User alread exists");

    const hashedPassword = await bc.hash(regDto.password, 10);
    const newUser = this.repo.create({
      email: regDto.email,
      name: regDto.username,
      password: hashedPassword,
    });
    await this.repo.save(newUser);
    return { ...newUser, token: this.createToken(newUser) };
  }

  createToken(user: User) {
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_KEY,
    );
    return token;
  }
}
