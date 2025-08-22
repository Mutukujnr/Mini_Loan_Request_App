import { HttpService } from '@nestjs/axios';
import { Body, Controller, Post } from '@nestjs/common';
import { LoanStatus } from 'src/enums/loan-status.enum';
import { LoanResponseDTO } from 'src/loan-request/dto/loan-response.dto';

@Controller('mock-credit-api')
export class MockCreditApiController {
  constructor(private httpService: HttpService) {}
  @Post('score')
  asignScoreToLoanRequest(
    @Body() payload: { savedLoan: LoanResponseDTO; callback_url: string },
  ) {
    const loan_id = payload.savedLoan.id;
    const creditSCore = 720;
    const status = LoanStatus.APPROVED;
    const reason = 'Good credit history';

    const responceData = {
      loan_id: loan_id,
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
