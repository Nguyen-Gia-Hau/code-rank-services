
// Import necessary modules and decorators from NestJS and TypeORM
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateContestDto } from './dto/create-contest.dto';  // DTO for creating contests
import { UpdateContestDto } from './dto/update-contest.dto';  // DTO for updating contests
import { UsersService } from 'src/users/services/users.service';  // Service to manage users
import { InjectRepository } from '@nestjs/typeorm';  // TypeORM decorator to inject repositories
import { Contest } from './entities/contest.entity';  // Contest entity definition
import { Repository } from 'typeorm';  // Repository for interacting with the database
import { ContestUser } from './entities/contest-user.entity';  // Entity representing contest participants
import { ContestProblem } from './entities/contest-problem.entity';  // Entity representing problems associated with a contest
import { CreateContestProblemDto } from './dto/create-contest-problem.dto';  // DTO for associating problems with contests
import { ProblemsService } from 'src/problems/problems.service';  // Service to manage problems
import { CreateContestUserDto } from './dto/create-contest-user.dto';  // DTO for adding users to contests
import { timeStamp } from 'console';

@Injectable()  // Marks the class as a NestJS service
export class ContestsService {
  constructor(
    private readonly userService: UsersService,  // Inject the UsersService for user-related operations
    private readonly problemService: ProblemsService,  // Inject the ProblemsService for problem-related operations
    @InjectRepository(Contest) private contestRepository: Repository<Contest>,  // Inject Contest repository
    @InjectRepository(ContestUser) private contestUserRepository: Repository<ContestUser>,  // Inject ContestUser repository
    @InjectRepository(ContestProblem) private ContestProblemRepository: Repository<ContestProblem>  // Inject ContestProblem repository
  ) { }

  // Method to create a new contest
  async create(createContestDto: CreateContestDto) {
    const created = this.contestRepository.create(createContestDto);  // Create a new contest entity
    const saved = await this.contestRepository.save(created);  // Save the contest to the database
    if (!saved) throw new ConflictException();  // Throw an error if the save operation fails
    return saved;  // Return the saved contest
  }

  // Method to associate a problem with a contest
  async createContestProblem(createContestProblemDto: CreateContestProblemDto): Promise<ContestProblem> {
    const problem = await this.problemService.findOne({ problem_id: createContestProblemDto.problem_id });  // Find the problem by its ID
    if (!problem) throw new NotFoundException('Problem not found');  // Throw an error if the problem is not found

    const contest = await this.findOne({ contest_id: createContestProblemDto.contest_id });  // Find the contest by its ID
    if (!contest) throw new NotFoundException('Contest not found');  // Throw an error if the contest is not found

    const created = this.ContestProblemRepository.create({  // Create a new ContestProblem entity
      contest: contest,
      problem: problem
    });
    const saved = await this.ContestProblemRepository.save(created);  // Save the association to the database
    if (!saved) throw new ConflictException('Failed to create contest problem');  // Throw an error if the save operation fails

    return saved;  // Return the saved ContestProblem entity
  }

  // Method to register a user for a contest
  async createContestUser(createContestUserDto: CreateContestUserDto) {
    const user = await this.userService.findOne({ user_id: createContestUserDto.user_id });  // Find the user by its ID
    if (!user) throw new NotFoundException();  // Throw an error if the user is not found

    const contest = await this.findOne({ contest_id: createContestUserDto.contest_id });  // Find the contest by its ID
    if (!contest) throw new NotFoundException('Contest not found');  // Throw an error if the contest is not found

    const userExistContest = await this.findOneUserContest({ user: user, contest: contest });  // Check if the user is already registered for the contest
    if (userExistContest) throw new ConflictException("Registered");  // Throw an error if the user is already registered

    const created = this.contestUserRepository.create({  // Create a new ContestUser entity
      contest: contest,
      user: user
    });

    const saved = await this.contestUserRepository.save(created);  // Save the registration to the database
    if (!saved) throw new ConflictException();  // Throw an error if the save operation fails

    await this.update(contest.contest_id, { participant_count: contest.participant_count + 1 })
    return saved
  }

  // Method to return all contests (placeholder implementation)
  findAll() {
    return `This action returns all contests`;  // Placeholder return value
  }

  // Method to find a contest based on a given condition
  async findOne(condition: Partial<Contest>) {
    return await this.contestRepository.findOne({ where: condition });  // Find and return the contest
  }

  // Method to find a user contest registration based on a given condition
  async findOneUserContest(condition: Partial<ContestUser>) {
    return await this.contestUserRepository.findOne({ where: condition });  // Find and return the ContestUser entity
  }

  async findOneProblemContest(condition: Partial<ContestProblem>) {
    return await this.ContestProblemRepository.findOne({ where: condition, relations: ['contest'] })
  }

  // Method to update a contest (placeholder implementation)
  async update(id: number, updateContestDto: UpdateContestDto) {
    await this.contestRepository.update({ contest_id: id }, updateContestDto)
    return this.findOne({ contest_id: id });
  }

  async updateContestUser(id: number, data: Partial<ContestUser>) {
    await this.contestUserRepository.update({ contest_user_id: id }, data)
    return this.findOneUserContest({ contest_user_id: id })
  }

  // Method to remove a contest (placeholder implementation)
  remove(id: number) {
    return `This action removes a #${id} contest`;  // Placeholder return value
  }

  async getRankList(contestID: number) {
    const contest = await this.findOne({ contest_id: contestID })
    if (!contest) throw new NotFoundException();


  }
}

