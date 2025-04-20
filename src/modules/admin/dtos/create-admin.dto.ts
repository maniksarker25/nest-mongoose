import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { Gender } from 'src/modules/normal-user/enum/normal-user.enum';

export class CreateAdminDto {
  @IsMongoId({ message: 'UserId must be a mongodb id' })
  @IsNotEmpty({ message: 'User id is required' })
  user: string;
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email is not valid' })
  @IsString({ message: 'Email is must be a string' })
  email: string;
  @IsString({ message: 'Phone number must be a string' })
  phone?: string;
  @IsNumber({}, { message: 'Age must be a number' })
  age?: number;
  @IsString({ message: 'Profile image must be a string' })
  profile_image?: string;
  @IsEnum(Gender, { message: 'Gender must be male or female' })
  gender?: Gender;
  @IsString({ message: 'Password must be string' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
  @IsNotEmpty({ message: 'Confirm password is required' })
  @IsString({ message: 'Confirm password must be a string' })
  confirmPassword: string;
}
