import crypto from 'crypto';
import bcrypt from "bcrypt";
import { findUserByEmail } from './userService.js';

export const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

export const hashToken = (token) => {
  const hash = crypto.createHash('sha256');
  hash.update(token);
  return hash.digest('hex');
};

export const compareToken = (token, hashedToken) => {
  const hash = crypto.createHash('sha256');
  hash.update(token);
  return hashedToken === hash.digest('hex');
};

export const isTokenExpired = (expiration) => {
  const now = Date.now();
  return now > expiration;
};

export const verifyResetToken = async (email, token) => {
  const user = await findUserByEmail(email);
  const match = compareToken(token, user.reset_token);

  if (!match || isTokenExpired(user.reset_token_expiration)) {
    throw new Error('Invalid or expired reset token');
  }

  return user;
};