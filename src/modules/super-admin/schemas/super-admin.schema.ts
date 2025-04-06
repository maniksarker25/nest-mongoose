import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from 'src/modules/user/schemas/user.schema';
@Schema({ timestamps: true })
export class SuperAdmin extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId | User;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  email: string;
  @Prop()
  age: number;
  @Prop()
  profile_image: string;
}

export const SuperAdminSchema = SchemaFactory.createForClass(SuperAdmin);
