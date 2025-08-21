/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Logger, Param, ParseIntPipe, Post } from '@nestjs/common';
import { LoanRequestDTO } from './dto/loan-request.dto';
import { LoanResponseDTO } from './dto/loan-response.dto';
import { LoanRequestService } from './loan-request.service';
import { LoanRequest } from './loan-request.entity';

@Controller('loan')
export class LoanRequestController {
  constructor(private loanService: LoanRequestService) { }
  @Post('request')
  async createLoan(
    @Body() createLoan: LoanRequestDTO,
  ): Promise<LoanResponseDTO> {
    return await this.loanService.createLoanRequest(createLoan);
  }

  @Get(':id')
  async getLoanById(@Param('id', ParseIntPipe) id: number): Promise<LoanRequest | null> {
    return this.loanService.findLoanRequestById(id);
  }

  @Get('pending/:userId')
  async getPendingCounts(@Param('userId', ParseIntPipe) userId:number): Promise<number> {
    return this.loanService.findUserLoanRequestPendingStatus(userId);
  }
  @Get('user/:userId')
  async getUserLoans(@Param('userId', ParseIntPipe) userId: number): Promise<LoanResponseDTO[]> {
    const loans = await this.loanService.findUserLoans(userId);
    return loans;
  }
  @Get('all')
  async getAllLoans(): Promise<LoanResponseDTO[]> {
    return this.loanService.findAllLoanRequests();
  }

  @Post('webhook/credit-score')
  displayData(@Body() payload) {
    
    Logger.log('payload received',payload);
  }

  
}
