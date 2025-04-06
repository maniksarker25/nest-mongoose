import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from 'src/modules/user/schemas/user.schema';
import { Model } from 'mongoose';
import { ConfigService } from '@nestjs/config';
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
}
