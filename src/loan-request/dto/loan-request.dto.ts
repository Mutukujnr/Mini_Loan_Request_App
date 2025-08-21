import { IsNotEmpty, IsNumber } from 'class-validator';

export class LoanRequestDTO {
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  reason: string;

  @IsNumber()
  userId: number;
}
