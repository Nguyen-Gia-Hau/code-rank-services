

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserProfile } from '../entities/user.profile.entity';
import { UpdateProfileDto } from '../dto/profile/update-profile.dto';

@Injectable()
export class UserProfilesService {
  constructor(
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
  ) {
  }
  async create(userID: number) {
    const createdProfile = this.userProfileRepository.create({ userId: userID })
    const savedUser = await this.userProfileRepository.save(createdProfile)
    return savedUser
  }

  async findOne(condition: Partial<UserProfile>, select?: (keyof UserProfile)[]) {
    return await this.userProfileRepository.findOne({
      where: condition,
      ...(select ? { select } : {}), // Use the select array if provided
    });
  }


  async update(userID: number, updateProfileDto: UpdateProfileDto) {
    const userProfile = await this.findOne({ userId: userID })

    if (!userProfile) throw new NotFoundException(`User profile with ID ${userID} not found`)

    // Update fields with values in DTO
    Object.assign(userProfile, updateProfileDto)

    // save change
    return await this.userProfileRepository.save(userProfile)
  }
}
