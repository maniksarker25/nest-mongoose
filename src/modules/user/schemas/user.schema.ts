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
  isJWTIssuedBeforePasswordChange(
    passwordChangeTimeStamp: Date,
    jwtIssuedTimeStamp: number,
  ): Promise<boolean>;
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop()
  profileId: string;

  @Prop({ required: true, unique: true, lowercase: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: false })
  isBlocked: boolean;

  @Prop({ default: false })
  isVerified: boolean;
  @Prop({})
  verifyCode: number;

  @Prop({})
  codeExpireIn: Date;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ default: 'user' })
  role: 'user' | 'admin' | 'superAdmin';
  @Prop()
  passwordChangedAt?: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// the static method
UserSchema.methods.comparePassword = async function (
  plainPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, this.password);
};

UserSchema.statics.isJWTIssuedBeforePasswordChange = async function (
  passwordChangeTimeStamp: Date,
  jwtIssuedTimeStamp: number,
): Promise<boolean> {
  const passwordChangeTime = new Date(passwordChangeTimeStamp).getTime() / 1000;
  return passwordChangeTime > jwtIssuedTimeStamp;
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
