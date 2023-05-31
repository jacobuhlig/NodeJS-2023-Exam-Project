import bcrypt from "bcrypt";
import crypto from 'crypto';
import { doesEmailExist } from "../services/userService.js";
import { sendResetPassword } from "../util/nodemailer/nodemailer.js";
import { Op } from 'sequelize';
import { User } from '../database/models/index.js';



export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await doesEmailExist(email);

        // Compare password with stored hash
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ message: 'Incorrect password' });
        }

        // If the password matches, set the user ID in the session
        req.session.user = user.id;
        req.session.role = user.role;
        return res.json({ message: 'Logged in successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'An error occurred', error: err.toString() });
    }
};



export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Username, email or password is missing' });
        }

        // Check if email is already in use
        const existingUser = await User.findOne({ 
            where: { 
                [Op.or]: [
                    { email: email },
                    { username: username }
                ]
            } 
        });

        if (existingUser) {
            return res.status(409).json({ message: 'Email or username is already in use' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Create new user
        const newUser = await User.create({ username, email, password: passwordHash });

        // Set user ID in session
        req.session.user = newUser.id;
        return res.status(201).json({ message: 'Signed up successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'An error occurred', error: err.toString() });
    }
};



// Reset Password route
export const forgot = async (req, res) => {
    const { email } = req.body;
    let username;

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'No user found with this email' });
        }
        username = user.username;

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');

        // Encrypt reset token
        const encryptedResetToken = await bcrypt.hash(resetToken, 12);

        // Set expiration date for reset token to 1 hour in the future
        const resetTokenExpiration = Date.now() + 3600000; // 3600000 milliseconds = 1 hour

        // Save reset token and expiration date in user record
        user.reset_token = encryptedResetToken;
        user.reset_token_expiration = resetTokenExpiration;
        await user.save();

        // Include reset token in reset password URL
        const resetPasswordUrl = `${resetToken}`;

        // Send reset password email
        const response = await sendResetPassword(email, username, resetPasswordUrl);
        console.log(response);
        return res.status(200).send({message: "Password reset email sent successfully."});
    } catch (err) {
        return res.status(500).json({ message: 'Failed to send reset password email', error: err.toString() });
    }
};



export const reset = async (req, res) => {
    const { token } = req.params;

    try {
        // Find user with requested reset token
        const user = await User.findOne({ where: { reset_token: token } });
        if (!user || !(await bcrypt.compare(token, user.reset_token))) {
            return res.status(401).json({ message: 'Invalid or expired reset token' });
        }

        // Check if token has expired
        const now = Date.now();
        if (now > user.reset_token_expiration) {
            return res.status(401).json({ message: 'Reset token has expired' });
        }

        // If the token is valid and not expired, render form to enter new password
        return res.status(200).json({ message: 'Please enter a new password' });
    } catch (err) {
        return res.status(500).json({ message: 'An error occurred', error: err.toString() });
    }
};



export const confirmResetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        // Find user with requested reset token
        const user = await User.findOne({ where: { reset_token: token } });
        if (!user || !(await bcrypt.compare(token, user.reset_token))) {
            return res.status(401).json({ message: 'Invalid or expired reset token' });
        }

        // Check if token has expired
        const now = Date.now();
        if (now > user.reset_token_expiration) {
            return res.status(401).json({ message: 'Reset token has expired' });
        }

        // Hash new password
        const passwordHash = await bcrypt.hash(password, 12);

        // Update user's password in the database
        user.password = passwordHash;
        user.reset_token = null;
        user.reset_token_expiration = null;
        await user.save();

        // Destroy session
        req.session.destroy((err) => {
            if(err) {
                return res.status(500).json({ message: 'Failed to destroy the session' });
            } else {
                return res.status(200).json({ message: 'Password reset successfully. Please log in with your new password.' });
            }
        });
    } catch (err) {
        return res.status(500).json({ message: 'An error occurred', error: err.toString() });
    }
};



export const signout = async (req, res) => {
    try {
        req.session.destroy((err) => {
            if(err) {
                return res.status(500).json({ message: 'Failed to destroy the session' });
            } else {
                return res.json({ message: 'Logged out successfully' });
            }
        });
    } catch (err) {
        return res.status(500).json({ message: 'An error occurred', error: err.toString() });
    }
};
