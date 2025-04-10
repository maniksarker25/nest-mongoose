import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Gender } from '../enum/normal-user.enum';
import { User } from 'src/modules/user/schemas/user.schema';
import { Address, AddressSchema } from './address.schema';
@Schema({ timestamps: true })
export class NormalUser extends Document {
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  user: Types.ObjectId | User;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  phone: string;
  @Prop()
  age: number;
  @Prop({ required: true, enum: Gender })
  gender: Gender;
  @Prop()
  profile_image: string;
  @Prop({ type: AddressSchema, required: false })
  address: Address;
}

export const NormalUserSchema = SchemaFactory.createForClass(NormalUser);
