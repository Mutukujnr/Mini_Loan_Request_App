import { LoanRequestDTO } from './dto/loan-request.dto';
import { LoanResponseDTO } from './dto/loan-response.dto';
import { LoanRequest } from './loan-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanRequestMapper } from './dto/mapper';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { LoanStatus } from 'src/enums/loan-status.enum';
import { HttpService } from '@nestjs/axios';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class LoanRequestService {
  constructor(
    @InjectRepository(LoanRequest)
    private loanRepository: Repository<LoanRequest>,
    private userService: UserService,
    private httpService: HttpService,
  ) {}
  async createLoanRequest(
    loanRequest: LoanRequestDTO,
  ): Promise<LoanResponseDTO> {
    const user = await this.userService.findOne(loanRequest.userId);
    if (!user) {
      throw new BadRequestException(
        `User with ID ${loanRequest.userId} does not exist`,
      );
    }

    const pendingStatusCount = await this.findUserLoanRequestPendingStatus(
      loanRequest.userId,
    );

    if (pendingStatusCount > 0) {
      throw new ConflictException('duplicate pending loan status');
    }

    const newLoanRequest = this.loanRepository.create(loanRequest);
    const savedLoanRequest = await this.loanRepository.save(newLoanRequest);

    const savedLoan = await this.loanRepository.findOne({
      where: { id: savedLoanRequest.id },
      relations: ['user'],
    });

    if (!savedLoan) {
      throw new NotFoundException('Loan request not found');
    }

    this.WebHookHandler(savedLoan);

    return LoanRequestMapper.mapToDto(savedLoan);
  }

  @Cron('10 * * * * *')
  WebHookHandler(savedLoan: LoanRequest) {
    const webhook_api = 'http://localhost:3000/mock-credit-api/score';
    const callback_url = 'http://localhost:3000/loan/webhook/credit-score';

    this.httpService.post(webhook_api, { savedLoan, callback_url }).subscribe({
      complete: () => {
        console.log('data send successfully to a third party');
      },
      error: () => {
        console.log('data not send');
      },
    });
  }

  async findLoanRequestById(id: number): Promise<LoanRequest | null> {
    return this.loanRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findUserLoanRequestPendingStatus(userId: number): Promise<number> {
    return this.loanRepository.count({
      where: {
        userId,
        status: LoanStatus.PENDING,
      },
      relations: ['user'],
    });
  }

  async findAllLoanRequests(): Promise<LoanResponseDTO[]> {
    const loans_requests: LoanRequest[] = await this.loanRepository.find({
      relations: ['user'],
    });
    return loans_requests.map((loan) => LoanRequestMapper.mapToDto(loan));
  }

  async findUserLoans(userId: number): Promise<LoanResponseDTO[]> {
    const loans = await this.loanRepository.find({
      where: { userId },
      relations: ['user'],
    });
    return loans.map((loan) => LoanRequestMapper.mapToDto(loan));
  }
}
