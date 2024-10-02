
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('languages')
@Unique(['language_id'])
export class Language {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  language_id: number;

  @Column({ type: 'varchar', length: 10 })
  name: string;

  @Column({ type: 'varchar', length: 5 })
  file_extension: string;
}

