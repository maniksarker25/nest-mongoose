import { Prop, Schema } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';
@Schema({ timestamps: true })
export class Admin extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId | User;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop()
  phone: string;
  @Prop()
  age: number;
  @Prop()
  profile_image: string;
  @Prop({ default: true })
  isActive: boolean;
  @Prop({ default: false })
  isDeleted: boolean;
}
