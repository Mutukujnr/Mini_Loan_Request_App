import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UserUpdateDTO {
  @IsNotEmpty()
  @IsNumber()
  id: number;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone_number: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
