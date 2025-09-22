import jwt from "jsonwebtoken";
import { loadEnvironment } from "../config/env.js";
const env = loadEnvironment();
export function signAccessToken(payload) {
    const secret = env.jwtSecret;
    const options = { expiresIn: env.jwtExpiresIn };
    return jwt.sign(payload, secret, options);
}
export function signRefreshToken(payload) {
    const secret = env.jwtSecret;
    const options = { expiresIn: env.jwtRefreshExpiresIn };
    return jwt.sign(payload, secret, options);
}
export function verifyToken(token) {
    return jwt.verify(token, env.jwtSecret);
}
