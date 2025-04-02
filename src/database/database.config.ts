import { registerAs } from '@nestjs/config';

export const DatabaseConfig = registerAs('database', () => ({
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/nestjs_example',
  dbName: process.env.MONGO_DB || 'nestDB',
}));
