import { IsInt, IsString } from 'class-validator';

export class CreateStravaTokenDto {
  @IsInt()
  athleteId: number;

  @IsString()
  accessToken: string;

  @IsString()
  refreshToken: string;

  @IsInt()
  expiresAt: number;
}
