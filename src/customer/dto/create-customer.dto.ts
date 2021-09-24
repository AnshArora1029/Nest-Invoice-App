import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateCustomerDto {
  @IsNotEmpty()
  @MaxLength(25)
  name: string;

  phone: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @MaxLength(50)
  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  city: string;

  @IsNotEmpty()
  pincode: number;

  @IsNotEmpty()
  customer: string;
}
