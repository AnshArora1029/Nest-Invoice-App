import { IsEmail, IsEnum, IsNotEmpty } from 'class-validator';
import { UserRole } from '../models/users.interface';

export class CreateUserDto {
  @IsNotEmpty()
  name?: string;

  @IsNotEmpty()
  username?: string;

  @IsNotEmpty()
  @IsEmail()
  email?: string;

  @IsNotEmpty()
  password?: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role?: UserRole;
}
