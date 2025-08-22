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
import { LoanUpdateDTO } from './dto/loan-update.dto';

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
    const savedLoanDTO = LoanRequestMapper.mapToDto(savedLoan);

    this.WebHookHandler(savedLoanDTO);

    return savedLoanDTO;
  }

  WebHookHandler(savedLoan: LoanResponseDTO) {
    const webhook_api = 'http://localhost:3000/mock-credit-api/score';
    const callback_url = 'http://localhost:3000/loan/webhook/credit-score';

    this.httpService.post(webhook_api, { savedLoan, callback_url }).subscribe({
      complete: () => {
        //console.log('data send successfully to mock credit api');
      },
      error: () => {
        //console.log('data not send');
      },
    });
  }

  @Cron('10 * * * * *')
  async processPendingLoans() {
    try {
      const pendingLoans = await this.findLoanByStatus(LoanStatus.PENDING);
      if (pendingLoans.length === 0) {
        console.log('No pending loans to process');
        return;
      }

      for (const loan of pendingLoans) {
        this.WebHookHandler(loan);
      }

      // const userInfo = await this.getPendingLoanStatusInfoForUser();
      // console.log(
      //   `Processing pending loan for user ${JSON.stringify(userInfo)}`,
      // );

      console.log(`processing ${pendingLoans.length} pending loans`);
    } catch (error) {
      console.log('Error processing pending loans:', error);
    }
  }

  async getPendingLoanStatusInfoForUser(): Promise<any[]> {
    const users = await this.findLoanByStatus(LoanStatus.PENDING);

    // return only the nested user objects
    return users.map((u) => u.user);
  }

  async findLoanByStatus(status: LoanStatus): Promise<LoanResponseDTO[]> {
    const loans = await this.loanRepository.find({
      where: {
        status: status,
      },
      relations: ['user'],
    });

    if (!loans) {
      throw new NotFoundException(`No loan was found ${status}`);
    }

    return loans.map((loan) => LoanRequestMapper.mapToDto(loan));
  }

  async findLoanRequestById(id: number): Promise<LoanRequest | null> {
    return await this.loanRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findUserLoanRequestPendingStatus(userId: number): Promise<number> {
    return await this.loanRepository.count({
      where: {
        userId,
        status: LoanStatus.PENDING,
      },
      relations: ['user'],
    });
  }

  async findAllLoanRequests(): Promise<LoanResponseDTO[]> {
    const loans_requests = await this.loanRepository.find({
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

  async updateLoanRequest(
    id: number,
    loanUpdateDTO: LoanUpdateDTO,
  ): Promise<LoanResponseDTO> {
    const loan = await this.loanRepository.findOne({
      where: { id: loanUpdateDTO.loan_id },
    });

    if (!loan) {
      throw new NotFoundException('loan not found');
    }

    Object.assign(loan, loanUpdateDTO);
    const updatedLoan = await this.loanRepository.save(loan);

    return LoanRequestMapper.mapToDto(updatedLoan);
  }
}
