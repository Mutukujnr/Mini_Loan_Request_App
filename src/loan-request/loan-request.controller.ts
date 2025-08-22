/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post } from '@nestjs/common';
import { LoanRequestDTO } from './dto/loan-request.dto';
import { LoanResponseDTO } from './dto/loan-response.dto';
import { LoanRequestService } from './loan-request.service';
import { LoanRequest } from './loan-request.entity';
import { LoanStatus } from 'src/enums/loan-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Controller('loan')
export class LoanRequestController {
  constructor(private loanService: LoanRequestService, @InjectRepository(LoanRequest) private loanRepository: Repository<LoanRequest>) { }
  @Post('request')
  async createLoan(
    @Body() createLoan: LoanRequestDTO,
  ): Promise<LoanResponseDTO> {
    return await this.loanService.createLoanRequest(createLoan);
  }

  @Get('all')
  async getAllLoans(): Promise<LoanResponseDTO[]> {
    return this.loanService.findAllLoanRequests();
  }

  @Get(':status')
  async getLoanByStatus(@Param('status') status: LoanStatus): Promise<LoanResponseDTO[]> {
    return await this.loanService.findLoanByStatus(status);
  }

  @Get(':id')
  async getLoanById(@Param('id', ParseIntPipe) id: number): Promise<LoanRequest | null> {
    return this.loanService.findLoanRequestById(id);
  }

  // @Patch(':id')
  // async updateLoanREquest(@Param('id') id: number, @Body() loanUpdateDTO: LoanUpdateDTO): Promise<LoanResponseDTO> {
  //   return this.loanService.updateLoanRequest(id, loanUpdateDTO);
  // }

  @Get('pending/:userId')
  async getPendingCounts(@Param('userId', ParseIntPipe) userId:number): Promise<number> {
    return this.loanService.findUserLoanRequestPendingStatus(userId);
  }
  @Get('user/:userId')
  async getUserLoans(@Param('userId', ParseIntPipe) userId: number): Promise<LoanResponseDTO[]> {
    const loans = await this.loanService.findUserLoans(userId);
    return loans;
  }

  @Post('webhook/credit-score')
  displayData(@Body() payload: { loan_id: number; [key: string]: any }) {
    
    Logger.log('payload received', JSON.stringify(payload));
    Logger.log(`loan id ${payload.loan_id}`);
  }

  // @Patch(':id')
  // async updateLoanREquest(
  //   @Param('id') id: number,
  //   @Body() payload: { loan_id: number; status: LoanStatus; reason?: string; creditScore: string }
  // ) {
  //   id = payload.loan_id;
  //   const payLoadData = {
  //     status: payload.status,
  //     reason: payload.reason,
  //   }

  //   const loan = await this.loanRepository.findOne({
  //     where: { id: id }
  //   });

  //   if (!loan) {
  //     throw new NotFoundException('loan not found');
  //   }

  //   Object.assign(loan, payLoadData);
  //   return  await this.loanRepository.save(loan);
  // }

  

  
}
