// Update the import path if the file exists elsewhere, for example:
import { LoanRequest } from '../loan-request/loan-request.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone_number: string;

  @Column()
  password: string;

  @OneToMany(() => LoanRequest, (loanRequest) => loanRequest.user)
  loanRequests: LoanRequest[];
}
