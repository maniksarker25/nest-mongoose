import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

// Custom User interface
export type UserDocument = User & Document;

// Custom Model interface for statics
export interface UserModel extends Model<UserDocument> {
  isPasswordMatched(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean>;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: 'user' })
  role: 'user' | 'admin' | 'superAdmin';
}

export const UserSchema = SchemaFactory.createForClass(User);

// the static method
UserSchema.statics.isPasswordMatched = async function (
  plainPassword: string,
  hashedPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

//  Pre-save hook: hash password
UserSchema.pre<UserDocument>('save', async function (next) {
  const user = this as User;
  if (user.isModified('password')) {
    const saltRounds = Number(10) || 10;
    user.password = await bcrypt.hash(user.password, saltRounds);
  }

  next();
});

UserSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});
