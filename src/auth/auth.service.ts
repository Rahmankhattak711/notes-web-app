import { ConflictException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from 'src/prisma/prisma.service';
import { jwtConstants } from '../config/constant';
import { LoginAuthDto } from './dto/login.auth.dto';
import { SignUpAuthDto } from './dto/signup.auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async signUp(createAuthDto: SignUpAuthDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: {
        email: createAuthDto.email,
      },
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(createAuthDto.password, 10);
    const newUser = await this.prisma.user.create({
      data: {
        username: createAuthDto.username,
        email: createAuthDto.email,
        password: hashedPassword,
      },
    });

    return {
      message: 'User created successfully',
      username: newUser.username,
      useremail: newUser.email,
    };
  }

  async login(loginAuthDto: LoginAuthDto) {
    const findUser = await this.prisma.user.findUnique({
      where: {
        email: loginAuthDto.email,
      },
    });

    if (!findUser) {
      throw new Error('User not found');
    }

    const comparePassword = await bcrypt.compare(
      loginAuthDto.password,
      findUser.password,
    );

    if (!comparePassword) {
      throw new ConflictException('Invalid credentials');
    }

    const accessToken = this.jwtService.signAsync(
      {
        id: findUser.id,
        email: findUser.email,
        username: findUser.username,
      },
      {
        secret: jwtConstants.secret,
        expiresIn: '1h',
      },
    );

    const refreshToken = this.jwtService.signAsync(
      {
        id: findUser.id,
        email: findUser.email,
        username: findUser.username,
      },
      { secret: jwtConstants.secret, expiresIn: '7d' },
    );

    await this.prisma.refreshToken.deleteMany({
      where: {
        userId: findUser.id,
      },
    });

    await this.prisma.refreshToken.create({
      data: {
        token: await refreshToken,
        userId: findUser.id,
      },
    });

    return {
      message: 'Login successful',
      accessToken: await accessToken,
      refreshToken: await refreshToken,
    };
  }
}
