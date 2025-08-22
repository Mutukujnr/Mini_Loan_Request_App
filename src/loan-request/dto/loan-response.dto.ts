export class LoanResponseDTO {
  id: number;

  amount: number;

  created_at: Date;

  updated_at: Date;

  status: string;

  user: {
    name: string;
    email: string;
    phone_number: string;
  };
}
