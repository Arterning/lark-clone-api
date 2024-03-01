import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(email);
    if (user?.password !== pass) {
      throw new UnauthorizedException();
    }

    const payload = {
      sub: user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        teamId: user.teamId,
      }
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(name: string, email: string, password: string) {
    const user = await this.userService.findOne(email);
    if (user) {
      throw new Error('User already exists');
    }
    return this.userService.createUser({ name, email, password });
  }
}
