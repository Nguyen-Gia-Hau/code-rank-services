
import { LoginTracker } from 'src/auth/entities/login.tracker.entity';
import { UserToken } from 'src/auth/entities/token.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne } from 'typeorm';

@Entity('users')
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  user_id: number;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 45 })
  username: string;

  @Column({ type: 'enum', enum: ['student', 'admin'], default: 'student' })
  role: 'student' | 'admin';

  @OneToOne(() => UserToken, userToken => userToken.user)
  userTokens: UserToken[];

  @OneToOne(() => LoginTracker, loginTracker => loginTracker.user)
  loginTrackers: LoginTracker[]
}

