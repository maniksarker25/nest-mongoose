import { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
  export interface Request {
    user?: JwtPayload; // or a custom User type if you've defined one
  }
}
