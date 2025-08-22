import { LoanStatus } from 'src/enums/loan-status.enum';
import { User } from 'src/user/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class LoanRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  amount: number;

  @Column({ default: null })
  reason: string;

  @Column({
    type: 'enum',
    enum: LoanStatus,
    default: LoanStatus.PENDING,
  })
  status: LoanStatus;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.loanRequests, {
    cascade: true,
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: number;
}
