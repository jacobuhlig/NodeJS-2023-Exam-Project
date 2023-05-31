import { User } from '../database/models/index.js';

export const doesEmailExist = async (email) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error('User not found with this email');
    }
    return user;
};
