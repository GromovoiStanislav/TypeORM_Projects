import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity({ name: 'tweets' })
export class Tweet {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 80 })
  title: string;

  @Column({ type: 'varchar', length: 300 })
  content: string;

  @ManyToOne(() => User, (user) => user.tweets, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  userId: string;
}
