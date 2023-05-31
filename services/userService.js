import { Op } from 'sequelize';
import { User } from '../database/models/index.js';

export const findUserByEmail = async (email) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('No user found with this email');
  }
  return user;
};

export const findUserByResetToken = async (token) => {
  const user = await User.findOne({ where: { reset_token: token } });
  if (!user) {
    throw new Error('Invalid or expired reset token');
  }
  return user;
};

export const checkIfEmailOrUsernameExists = async (username, email) => {
  const existingUser = await User.findOne({ 
    where: { 
      [Op.or]: [
        { email: email },
        { username: username }
      ]
    } 
  });
  return existingUser;
};

export const createUser = async ({ username, email, passwordHash }) => {
  return await User.create({ username, email, password: passwordHash });
};

export const updateUser = async (user, updateParams) => {
  Object.assign(user, updateParams);
  return await user.save();
};
