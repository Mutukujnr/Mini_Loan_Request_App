import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserRequestDTO {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  phone_number: string;

  @IsNotEmpty()
  password: string;
}
