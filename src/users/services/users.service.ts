import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UserProfile } from '../entities/user.profile.entity';
import { UserProfilesService } from './user.profiles.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private userProfileService: UserProfilesService
  ) {
  }

  async create(createUserDto: CreateUserDto) {
    const createdUser = this.usersRepository.create(createUserDto)
    const savedUser = await this.usersRepository.save(createdUser);
    const savedUserProfile = await this.userProfileService.create(savedUser.user_id)
    console.log(savedUserProfile)
    return savedUser
  }

  findAll() {
    return `This action returns all users`;
  }


  async findOne(condition: Partial<User>, select?: (keyof User)[]) {
    return await this.usersRepository.findOne({
      where: condition,
      ...(select ? { select } : {}), // Use the select array if provided
    });
  }

}
