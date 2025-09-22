import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { loadEnvironment } from "../config/env.js";

const env = loadEnvironment();

export type JwtPayload = {
  sub: string; // user id
  role: string;
};

export function signAccessToken(payload: JwtPayload): string {
  const secret: Secret = env.jwtSecret;
  const options: SignOptions = { expiresIn: env.jwtExpiresIn as unknown as SignOptions["expiresIn"] };
  return jwt.sign(payload, secret, options);
}

export function signRefreshToken(payload: JwtPayload): string {
  const secret: Secret = env.jwtSecret;
  const options: SignOptions = { expiresIn: env.jwtRefreshExpiresIn as unknown as SignOptions["expiresIn"] };
  return jwt.sign(payload, secret, options);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, env.jwtSecret) as JwtPayload;
}


