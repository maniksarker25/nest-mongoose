import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { NormalUser } from '../schemas/normal-user.schema';
import { Model } from 'mongoose';
import { UpdateNormalUserDto } from '../dtos/update-normal-user.dto';
import { QueryBuilder } from 'src/common/utils/builder/query-builder.util';
@Injectable()
export class NormalUserService {
  constructor(
    @InjectModel(NormalUser.name) private normalUserModel: Model<NormalUser>,
  ) {}

  async getAllUser(query: Record<string, unknown>) {
    const resultQuery = new QueryBuilder(this.normalUserModel.find(), query)
      .search(['name', 'email'])
      .filter()
      .sort()
      .paginate()
      .fields();
    const meta = await resultQuery.countTotal();
    const result = await resultQuery.modelQuery;
    return {
      meta,
      result,
    };
  }

  async updateNormalUser(id: string, dto: UpdateNormalUserDto) {
    return this.normalUserModel.findByIdAndUpdate(id, dto, {
      new: true,
      runValidators: true,
    });
  }
}
