import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Admin } from '../schemas/admin.schema';
import { Model, PipelineStage } from 'mongoose';
import { CreateAdminDto } from '../dtos/create-admin.dto';
import { AppError } from 'src/common/errors/app-error';
import { User } from 'src/modules/user/schemas/user.schema';
import { USER_ROLE } from 'src/modules/user/interfaces/user-role.type';
import pick from 'src/common/helpers/pick';
import calculatePagination from 'src/common/helpers/pagination-helper';
@Injectable()
export class AdminService {
  constructor(
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // create admin into db ==================================>

  async createAdminIntoDb(dto: CreateAdminDto) {
    const { password, confirmPassword, ...adminData } = dto;
    if (dto.password != dto.confirmPassword) {
      throw new AppError(
        HttpStatus.BAD_REQUEST,
        'Password and confirm password do not match',
      );
    }

    const isExists = await this.userModel.findOne({ email: dto.email });
    if (isExists) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'This email already exist');
    }

    const session = await this.adminModel.db.startSession();
    session.startTransaction();

    try {
      const userDataPayload = {
        email: dto.email,
        password: dto.password,
        role: USER_ROLE.admin,
        isVerified: true,
      };

      const user = await this.userModel.create([userDataPayload], { session });
      const adminDataPayload = {
        ...adminData,
        user: user[0]._id,
      };
      const result = await this.adminModel.create([adminDataPayload], {
        session,
      });
      await this.userModel.findByIdAndUpdate(
        user[0]._id,
        { profileId: result[0]._id },
        { new: true, runValidators: true, session },
      );

      await session.commitTransaction();
      session.endSession();
      return result[0];
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Transaction failed',
      );
    }
  }

  // get all admin from database =========================>
  async getAllAdminFromDB(query: Record<string, unknown>) {
    const filters = pick(query, ['searchTerm', 'email', 'gender']);
    const paginationOptions = pick(query, [
      'page',
      'limit',
      'sortBy',
      'sortOrder',
    ]);

    const { searchTerm } = filters;
    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(paginationOptions);

    // sort conditions =======
    const sortConditions: { [key: string]: 1 | -1 } = {};
    if (sortBy && sortOrder) {
      sortConditions[sortBy] = sortOrder === 'asc' ? 1 : -1;
    }

    // search condition ------
    const searchConditions: any[] = [];
    if (searchTerm) {
      searchConditions.push({
        $or: [
          { name: { $regex: searchTerm, $options: 'i' } },
          { email: { $regex: searchTerm, $options: 'i' } },
        ],
      });
    }

    if (query.isActive != undefined) {
      searchConditions.push({ isActive: query.isActive });
    }
    if (query.gender) {
      searchConditions.push({ gender: query.gender });
    }

    const queryConditions =
      searchConditions.length > 0 ? { $and: searchConditions } : {};
    const pipeline: PipelineStage[] = [
      {
        $match: queryConditions,
      },
      //   { $sort: sortConditions },
      //   { $skip: skip },
      //   { $limit: limit },
      {
        $facet: {
          admins: [
            { $sort: sortConditions },
            { $skip: skip },
            { $limit: limit },
          ],
          totalCount: [{ $count: 'totalCount' }],
        },
      },
    ];
    const result = await this.adminModel.aggregate(pipeline);
    const admins = result[0].admins;
    const totalCount = result[0].totalCount[0]
      ? result[0].totalCount[0].totalCount
      : 0;
    const meta = {
      page,
      limit,
      total: totalCount,
      totalPage: Math.ceil(totalCount / limit),
    };
    return {
      meta,
      result: admins,
    };
  }

  // change admin status ===========================>
  async changeAdminStatusIntoDB(id: string) {
    const user = await this.userModel.findById(id).select('user isActive');
    if (!user) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Admin user not found');
    }

    await this.userModel.findByIdAndUpdate(id, { isActive: !user.isActive });
    const result = await this.adminModel
      .findOne({ user: id })
      .populate({ path: 'user', select: 'isActive' });
    return result;
  }
}
