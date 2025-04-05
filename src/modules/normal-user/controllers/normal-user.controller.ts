import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { NormalUserService } from '../services/normal-user.service';
import { UpdateNormalUserDto } from '../dtos/update-normal-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { USER_ROLE } from 'src/modules/user/interfaces/user-role.type';

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

  // update normal user
  @Patch('update-user/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(USER_ROLE.user)
  async updateNormalUser(
    @Param('id') id: string,
    @Body() dto: UpdateNormalUserDto,
  ) {
    const result = await this.normalUserService.updateNormalUser(id, dto);
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: result,
    };
  }
}
