import { LoanRequest } from '../loan-request.entity';
import { LoanResponseDTO } from './loan-response.dto';

export class LoanRequestMapper {
  public static mapToDto(loanRequest: LoanRequest): LoanResponseDTO {
    const response = new LoanResponseDTO();
    response.id = loanRequest.id;
    response.amount = loanRequest.amount;
    response.created_at = loanRequest.created_at;
    response.status = loanRequest.status;
    response.user = {
      name: loanRequest.user.name,
      email: loanRequest.user.email,
      phone_number: loanRequest.user.phone_number,
    };

    return response;
  }
}
