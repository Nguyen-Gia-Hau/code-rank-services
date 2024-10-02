import { Injectable } from '@nestjs/common';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Problem } from './entities/problem.entity';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private readonly problemRepository: Repository<Problem>,
  ) { }

  async create(createProblemDto: CreateProblemDto) {
    const createdProblem = this.problemRepository.create(createProblemDto)
    return await this.problemRepository.save(createdProblem);
  }


  async findAll(condition: Partial<Problem>, selection?: (keyof Problem)[]) {
    const currentDate = new Date();
    const problems = await this.problemRepository.find({
      select: selection,
      where: {
        ...condition,
        public_time: LessThanOrEqual(currentDate)
      },
    });
    return problems;
  }



  async findOne(condition: Partial<Problem>) {
    const currentDate = new Date();

    return await this.problemRepository.findOne({
      where: {
        ...condition,
        public_time: LessThanOrEqual(currentDate)
      }
    });
  }


  async update(id: number, updateProblemDto: UpdateProblemDto) {
    await this.problemRepository.update({ problem_id: id }, updateProblemDto);
    return this.findOne({ problem_id: id })
  }

  async remove(id: number) {
    await this.problemRepository.delete({ problem_id: id })
    return {
      deleted: true
    }
  }
}
