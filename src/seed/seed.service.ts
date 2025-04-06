import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/modules/user/schemas/user.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
import { SuperAdmin } from 'src/modules/super-admin/schemas/super-admin.schema';
import { USER_ROLE } from 'src/modules/user/interfaces/user-role.type';
@Injectable()
export class SeedService {
  private logger = new Logger(SeedService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    @InjectModel(SuperAdmin.name)
    private superAdminModel: Model<any>,
    private config: ConfigService,
  ) {}

  async seedSuperAdmin() {
    const email = this.config.get<string>('super_admin.email');
    const password = this.config.get<string>('super_admin.password');

    const exists = await this.userModel.findOne({ role: USER_ROLE.superAdmin });
    if (exists) {
      this.logger.log('Super admin already exists');
      return;
    }

    const session = await this.userModel.db.startSession();
    session.startTransaction();

    try {
      const user = await this.userModel.create(
        [{ email, password, role: USER_ROLE.superAdmin, isVerified: true }],
        { session },
      );

      const superAdmin = await this.superAdminModel.create(
        [{ name: 'Mr admin', email, user: user[0]._id }],
        { session },
      );

      await this.userModel.findByIdAndUpdate(
        user[0]._id,
        { profileId: superAdmin[0]._id },
        { session },
      );

      await session.commitTransaction();
      this.logger.log('✅ Super admin seeded successfully');
    } catch (error) {
      await session.abortTransaction();
      this.logger.error('Failed to seed super admin', error);
    } finally {
      session.endSession();
    }
  }
}
