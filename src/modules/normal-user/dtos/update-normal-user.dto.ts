import { PartialType } from '@nestjs/mapped-types';
import { CreateNormalUserDto } from './create-normal-user.dto';

export class UpdateNormalUserDto extends PartialType(CreateNormalUserDto) {}
