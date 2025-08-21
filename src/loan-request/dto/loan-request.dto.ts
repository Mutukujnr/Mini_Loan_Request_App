import { IsNotEmpty, IsNumber } from 'class-validator';

export class LoanRequestDTO {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsNumber()
  @IsNotEmpty()
  userId: number;
}
