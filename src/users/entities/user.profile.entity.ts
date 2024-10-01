
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('user_profiles')
export class UserProfile {
  @PrimaryGeneratedColumn({ name: 'user_id', unsigned: true })
  userId: number;

  @Column({ name: 'last_name', type: 'varchar', length: 20, nullable: true })
  lastName: string;

  @Column({ name: 'first_name', type: 'varchar', length: 20, nullable: true })
  firstName: string;

  @Column({ name: 'problems_solved', type: 'int', width: 10, default: 0 })
  problemsSolved: number;

  @Column({ name: 'rank_points', type: 'int', width: 10, default: 0 })
  rankPoints: number;

  @Column({ name: 'total_points', type: 'int', width: 10, default: 0 })
  totalPoints: number;

  @Column({ name: 'about', type: 'longtext', nullable: true })
  about: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
