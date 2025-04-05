import {
  IsEmail,
  IsEnum,
  isNotEmpty,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { Gender } from 'src/modules/normal-user/enum/normal-user.enum';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Name is required' })
  name: string;
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  email: string;

  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
  @MinLength(6, {
    message: 'Confrim password must be at least 6 characters long',
  })
  confirmPassword: string;
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone number must be a string' })
  phone: string;
  @IsNotEmpty({ message: 'Age is required' })
  @IsNumber({}, { message: 'Age must be a number.' })
  age: number;
  @IsEnum(Gender, { message: 'Gender must be either male or female.' })
  gender: Gender;
}
