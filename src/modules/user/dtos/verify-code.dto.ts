import { IsEmail, IsNumber } from 'class-validator';

export class verifyCodeDto {
  @IsEmail()
  email: string;
  @IsNumber()
  code: number;
}
