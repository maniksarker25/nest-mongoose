import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { Gender } from '../enum/normal-user.enum';

export class CreateNormalUserDto {
  @IsMongoId({ message: 'User ID must be a valid Mongo ID.' })
  @IsNotEmpty({ message: 'User ID reference is required.' })
  user: string;
  @IsString({ message: 'Name must be a valid string' })
  @IsNotEmpty({ message: 'Name is required' })
  @MinLength(2, { message: 'Name must be at least 2 characters long' })
  name: string;
  @IsString({ message: 'Phone must be a valid number' })
  @IsNotEmpty({ message: 'Phone number is required' })
  phone: string;
  @IsOptional()
  @IsNumber({}, { message: 'Age must be a number.' })
  @Min(1, { message: 'Age must be at least 1.' })
  age?: number;
  @IsOptional()
  @IsString()
  profile_image?: string;
  @IsEnum(Gender, { message: 'Gender must be either male or female.' })
  gender: Gender;
}
