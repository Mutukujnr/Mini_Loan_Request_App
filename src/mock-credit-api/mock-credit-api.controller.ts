import { HttpService } from '@nestjs/axios';
import { Body, Controller, Post } from '@nestjs/common';
import { LoanStatus } from 'src/enums/loan-status.enum';
import { LoanRequest } from 'src/loan-request/loan-request.entity';

@Controller('mock-credit-api')
export class MockCreditApiController {
  constructor(private httpService: HttpService) {}
  @Post('score')
  asignScoreToLoanRequest(
    @Body() payload: { savedLoan: LoanRequest; callback_url: string },
  ) {
    const creditSCore = 720;
    const status = LoanStatus.APPROVED;
    const reason = 'Good credit history';

    const responceData = {
      loan_id: 'uuid',
      creditSCore: creditSCore,
      status: status,
      reason: reason,
    };

    this.httpService.post(payload.callback_url, responceData).subscribe({
      complete: () => {
        console.log(`data send  to ${payload.callback_url}`);
      },
      error: () => {
        console.log('error sending data');
      },
    });
  }
}
