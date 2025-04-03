import { Controller, Get, HttpStatus } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { NormalUserService } from '../services/normal-user.service';

@Controller('normal-user')
export class NormalUserController {
  constructor(private readonly normalUserService: NormalUserService) {}

  @Get('get-all')
  async getAllUser() {
    const result = await this.normalUserService.getAllUser();
    return {
      statusCode: HttpStatus.OK,
      message: 'User retrieved successfully',
      data: result,
    };
  }
}
