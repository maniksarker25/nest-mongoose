import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NormalUser } from '../schemas/normal-user.schema';
import { Model } from 'mongoose';
@Injectable()
export class NormalUserService {
  constructor(
    @InjectModel(NormalUser.name) private normalUserModel: Model<NormalUser>,
  ) {}

  async getAllUser() {
    return this.normalUserModel.find().exec();
  }
}
