export class LoanResponseDTO {
  amount: number;

  reason: string;

  created_at: Date;

  updated_at: Date;

  status: string;

  user?: {
    name: string;
    email: string;
    phone_number: string;
  };
}
