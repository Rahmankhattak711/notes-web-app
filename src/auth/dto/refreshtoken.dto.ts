import { IsJWT, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsString()
  userId: string;

  @IsJWT()
  token: string;
}
