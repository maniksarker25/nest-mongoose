import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NormalUser } from '../schemas/normal-user.schema';
import { Model } from 'mongoose';
import { UpdateUserDto } from 'src/modules/user/dtos/update-user.dto';
import { UpdateNormalUserDto } from '../dtos/update-normal-user.dto';
@Injectable()
export class NormalUserService {
  constructor(
    @InjectModel(NormalUser.name) private normalUserModel: Model<NormalUser>,
  ) {}

  async getAllUser() {
    return this.normalUserModel.find().exec();
  }

  async updateNormalUser(id: string, dto: UpdateNormalUserDto) {
    return this.normalUserModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
  }
}
