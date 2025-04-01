import { registerAs } from '@nestjs/config';

export const DatabaseConfig = registerAs('database', () => ({
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase',
}));
