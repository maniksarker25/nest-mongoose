import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { RegisterUserDto } from '../dtos/register-user.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { verifyCodeDto } from '../dtos/verify-code.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Post('/register-user')
  async registerUser(@Body() dto: RegisterUserDto) {
    const user = await this.userService.registerUser(dto);
    return {
      statusCode: 201,
      message: 'User created successfully',
      data: user,
    };
  }

  @Post('/verify-code')
  async verifyCode(@Body() dto: verifyCodeDto) {
    const result = await this.userService.verifyCode(dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Your email verified successfully',
      data: result,
    };
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.userService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
