import { Body, Post } from '@nestjs/common';
import { UserService } from 'src/modules/user/services/user.service';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { AdminService } from '../services/admin.service';

export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('/create-admin')
  async createAdmin(@Body() dto: CreateAdminDto) {
    const result = await this.adminService.createAdminIntoDb(dto);
    return {
      statusCode: 201,
      message: 'Admin created successfully',
      data: result,
    };
  }
}
