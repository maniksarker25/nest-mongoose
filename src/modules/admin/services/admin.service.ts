import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from '../schemas/admin.schema';
import { Model } from 'mongoose';
import { CreateAdminDto } from '../dtos/create-admin.dto';
@Injectable()
export class AdminService {
  constructor(@InjectModel(Admin.name) private adminModel: Model<Admin>) {}

  async createAdminIntoDb(dto: CreateAdminDto) {}
}
