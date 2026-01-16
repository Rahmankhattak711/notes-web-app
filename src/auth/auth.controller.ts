import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpAuthDto } from './dto/signup.auth.dto';
import { LoginAuthDto } from './dto/login.auth.dto';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signUp(@Body() createAuthDto: SignUpAuthDto) {
    return this.authService.signUp(createAuthDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }

@Get('profile/:userId')
getProfile(@Param('userId') userId: string) {
  return this.authService.getProfile(userId);
}
}
