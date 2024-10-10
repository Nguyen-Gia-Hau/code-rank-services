import { Language } from 'src/languages/entities/language.entity';
import { Problem } from 'src/problems/entities/problem.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('submissions')
export class Submission {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  submission_id: number;

  @ManyToOne(() => Problem, (problem) => problem.submissions)
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;

  @ManyToOne(() => User, (user) => user.submissions)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Language, (language) => language.submissions)
  @JoinColumn({ name: 'language_id' })
  language: Language;

  @Column('longtext', { nullable: true })
  source_code: string;

  @Column({ type: 'int' })
  status: number; // 0 is incorrect, 1 is correct

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  submission_time: Date;
}

