
import { LoginTracker } from 'src/auth/entities/login.tracker.entity';
import { UserToken } from 'src/auth/entities/token.entity';
import { Entity, Column, PrimaryGeneratedColumn, Unique, OneToOne } from 'typeorm';

@Entity('users') // Tên bảng
@Unique(['username']) // Đảm bảo username là duy nhất
export class User {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  user_id: number; // Trường chính

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 45 })
  username: string; // Thêm trường username

  @OneToOne(() => UserToken, userToken => userToken.user)
  userTokens: UserToken[]; // Trường này để quản lý danh sách token của người dùng

  @OneToOne(() => LoginTracker, loginTracker => loginTracker.user)
  loginTrackers: LoginTracker[]
}

