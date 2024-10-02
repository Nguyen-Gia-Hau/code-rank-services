
import { ProblemType } from 'src/problem-types/entities/problem-type.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('problems')
export class Problem {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  problem_id: number;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'longtext' }) description: string;

  @Column({ type: 'enum', enum: ['Easy', 'Medium', 'Hard'] })
  difficulty: 'Easy' | 'Medium' | 'Hard';

  @Column({ type: 'longtext', nullable: true })
  input_format: string;

  @Column({ type: 'longtext', nullable: true })
  output_format: string;

  @Column({ type: 'longtext', nullable: true })
  example_input: string;

  @Column({ type: 'longtext', nullable: true })
  example_output: string;

  @Column({ type: 'longtext', nullable: true })
  notes: string;

  @Column({ type: 'int', default: 1 })
  time_limit: number;

  @Column({ type: 'int', default: 256 })
  memory_limit: number;

  @Column({ type: 'int', default: 0 })
  total_submissions: number;

  @Column({ type: 'int', default: 0 })
  total_correct: number;

  @Column({ type: 'int', default: 1 })
  point: number;

  @Column({ type: 'date' })
  public_time: Date;

  @Column({ type: 'int', unsigned: true })
  type_id: number; // Khai báo type_id để lưu trữ ID của ProblemType

  @ManyToOne(() => ProblemType, (problemType) => problemType.problems, { nullable: false })
  @JoinColumn({ name: 'type_id' }) // Thiết lập mối quan hệ ManyToOne với ProblemType
  problemType: ProblemType; // Đối tượng ProblemType liên quan
}

