import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { NormalUserService } from '../services/normal-user.service';
import { UpdateNormalUserDto } from '../dtos/update-normal-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { USER_ROLE } from 'src/modules/user/interfaces/user-role.type';
import { SingleFileUpload } from 'src/common/interceptors/file.interceptor';
import { UploadField } from 'src/common/enum/upload-file.enum';
import { ParseFormDataPipe } from 'src/common/pipes/parse-formdata.pipe';

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
  @UseInterceptors(SingleFileUpload(UploadField.PROFILE_IMAGE))
  async updateNormalUser(
    @Param('id') id: string,
    @Body(ParseFormDataPipe) dto: UpdateNormalUserDto,
    @UploadedFile() profileImage: Express.Multer.File,
    // @UploadedFiles() additionalImages: Express.Multer.File[],
  ) {
    const profile_image = profileImage?.filename;
    // const additionalImagePaths =
    //   additionalImages?.map((file) => file.filename) || [];
    const result = await this.normalUserService.updateNormalUser(id, {
      ...dto,
      profile_image,
    });
    return {
      statusCode: HttpStatus.OK,
      message: 'User updated successfully',
      data: result,
    };
  }
}
