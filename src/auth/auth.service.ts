import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload.type';
import { SafeUser, UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto) {
    const existingUser = await this.usersService.findByLoginId(dto.loginId);

    if (existingUser) {
      throw new ConflictException('Login ID is already taken.');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);
    let user: SafeUser;

    try {
      user = await this.usersService.createUser({
        loginId: dto.loginId,
        passwordHash,
        name: dto.name,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Login ID is already taken.');
      }

      throw error;
    }

    return this.createAuthResponse(user);
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByLoginId(dto.loginId);

    if (!user) {
      throw new UnauthorizedException('Invalid login ID or password.');
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid login ID or password.');
    }

    return this.createAuthResponse({
      id: user.id,
      loginId: user.loginId,
      name: user.name,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  }

  async me(userId: string): Promise<SafeUser> {
    const user = await this.usersService.findSafeById(userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

  private createAuthResponse(user: SafeUser) {
    const payload: JwtPayload = {
      sub: user.id,
      loginId: user.loginId,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user,
    };
  }
}
