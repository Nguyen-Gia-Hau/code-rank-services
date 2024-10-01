

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserProfile } from '../entities/user.profile.entity';

@Injectable()
export class UserProfilesService {
  constructor(
    @InjectRepository(User)
    private userProfileRepository: Repository<UserProfile>,
  ) {
  }
  async create(userID: number) {
    const createdProfile = this.userProfileRepository.create({ userId: userID })
    const savedUser = await this.userProfileRepository.save(createdProfile)
    return savedUser
  }
}
