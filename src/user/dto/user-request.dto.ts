import { IsEmail, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class UserRequestDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  phone_number: string;

  @IsNotEmpty()
  password: string;
}
