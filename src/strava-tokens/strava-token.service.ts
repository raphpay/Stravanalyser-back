import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';
import { CreateStravaTokenDto } from './dto/create-strava-token.dto';
import { StravaTokenEntity } from './strava-token.entity';

@Injectable()
export class StravaTokenService {
  constructor(
    @InjectRepository(StravaTokenEntity)
    private tokenRepo: Repository<StravaTokenEntity>,
  ) {}

  async upsertToken(input: CreateStravaTokenDto) {
    let token = await this.tokenRepo.findOneBy({
      athleteId: input.athleteId,
    });
    if (token) {
      token.accessToken = input.accessToken;
      token.refreshToken = input.refreshToken;
      token.expiresAt = input.expiresAt;
      return this.tokenRepo.save(token);
    }

    return this.tokenRepo.save(this.tokenRepo.create(input));
  }

  async findTokenByAthlete(athleteId: number) {
    return this.tokenRepo.findOneBy({ athleteId });
  }
}
