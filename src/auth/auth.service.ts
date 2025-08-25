/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtSErvice: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findUserByEmail(email, true);

    if (!user) {
      return new UnauthorizedException();
    }

    const isMatching = await bcrypt.compare(pass, user.password);

    if (!isMatching) {
      return null;
    }

    return user;
  }

  login(user: any) {
    const payLoad = { email: user.email, sub: user.id };

    return {
      access_token: this.jwtSErvice.sign(payLoad),
    };
  }
}
