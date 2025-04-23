import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { AdminService } from '../services/admin.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { USER_ROLE } from 'src/modules/user/interfaces/user-role.type';
import { User } from 'src/modules/user/schemas/user.schema';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // create admin ====================>
  @Post('create-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.superAdmin)
  async createAdmin(@Body() dto: CreateAdminDto) {
    const result = await this.adminService.createAdminIntoDb(dto);
    return {
      statusCode: 201,
      message: 'Admin created successfully',
      data: result,
    };
  }

  // get all admin ==========================>
  @Get('get-all-admin')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.superAdmin)
  async getAllAdmin(@Query() query: Record<string, unknown>) {
    const result = await this.adminService.getAllAdminFromDB(query);
    return {
      statusCode: HttpStatus.OK,
      message: 'All admin retrieved successfully',
      data: result,
    };
  }

  // change admin status ===================================>
  @Patch('/change-status/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.superAdmin)
  async changeAdminStatus(@Param() id: string) {
    const result = await this.adminService.changeAdminStatusIntoDB(id);
    const message = (result?.user as User).isActive
      ? 'Admin activated successfully'
      : 'Admin deactivated successfully';
    return {
      statusCode: HttpStatus.OK,
      message,
      data: result,
    };
  }
}
