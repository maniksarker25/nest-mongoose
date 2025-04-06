export interface JwtDecodedUser {
  id: string;
  profileId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
