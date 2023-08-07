import { sendResetPassword } from '../util/nodemailer/nodemailer.js';
import {
  findUserByEmail,
  checkIfEmailOrUsernameExists,
  findUserByResetToken,
  createUser,
  updateUser,
} from '../services/userService.js';
import { hashPassword, comparePassword } from '../services/passwordService.js';
import { createSession, destroySession } from '../services/sessionService.js';
import {
  generateResetToken,
  hashToken,
  compareToken,
  isTokenExpired,
  verifyResetToken,
} from '../services/tokenService.js';

export const status = (req, res) => {
  // console.log(`session info:`);
  // console.log(req.session);
  // console.log(req.session.cookie);
  if (req.session.user) {
    console.log(req.session.user);
    res.json({
      message: 'User is currently logged in',
      user: req.session.user,
    });
  } else {
    res.status(401).json({ message: 'Not Authorized' });
  }
};

export const signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await findUserByEmail(email);
    const match = await comparePassword(password, user.password);

    if (!match) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    createSession(req, user);
    return res.json({
      message: 'Logged in successfully',
      user: {
        id: req.session.user.id,
        role: req.session.user.role,
        email: req.session.user.email,
        username: req.session.user.username,
      },
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'Failed to login', error: err.toString() });
  }
};

export const signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const existingUser = await checkIfEmailOrUsernameExists(username, email);

    if (existingUser) {
      return res
        .status(409)
        .json({ message: 'Email or username is already in use' });
    }

    const passwordHash = await hashPassword(password);
    const newUser = await createUser({ username, email, passwordHash });

    createSession(req, newUser);
    return res.status(201).json({ message: 'Signed up successfully' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'An error occurred', error: err.toString() });
  }
};

export const forgot = async (req, res) => {
  const { email } = req.body;
  console.log(email);

  try {
    const user = await findUserByEmail(email);
    console.log(user);
    const resetToken = generateResetToken();
    console.log(resetToken);
    const encryptedResetToken = await hashToken(resetToken);
    console.log(encryptedResetToken);
    const resetTokenExpiration = Date.now() + 10800000;
    console.log(resetTokenExpiration);
    console.log('expiration: ' + resetTokenExpiration);

    await updateUser(user, {
      reset_token: encryptedResetToken,
      reset_token_expiration: resetTokenExpiration,
    });

    const encodedEmail = encodeURIComponent(user.email);

    const resetPasswordUrl = `${resetToken}?email=${encodedEmail}`;
    await sendResetPassword(email, user.username, resetPasswordUrl);

    return res
      .status(200)
      .send({ message: 'Password reset email sent successfully.' });
  } catch (err) {
    return res.status(500).json({
      message: 'Failed to send reset password email',
      error: err.toString(),
    });
  }
};

export const reset = async (req, res) => {
  console.log(1);
  const { token } = req.params;
  console.log(2);
  console.log(token);
  console.log(3);
  const email = req.query.email;
  console.log(email);
  const emailDecoded = decodeURIComponent(req.query.email);
  console.log(emailDecoded);
  console.log(4);

  try {
    await verifyResetToken(email, token);
    return res.status(200).json({ message: 'Please enter a new password' });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

export const confirmResetPassword = async (req, res) => {
  console.log(`Got to: confirmResetPassword`);
  const { token } = req.params;
  const { password } = req.body;
  const email = decodeURIComponent(req.query.email);

  try {
    console.log('email' + email);
    const user = await verifyResetToken(email, token);

    const passwordHash = await hashPassword(password);
    await updateUser(user, {
      password: passwordHash,
      reset_token: null,
      reset_token_expiration: null,
    });

    destroySession(req, res);
    return res.status(200).json({
      message:
        'Password reset successfully. You can now login with your new password.',
    });
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};

export const signout = async (req, res) => {
  try {
    destroySession(req, res);
    return res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    return res
      .status(500)
      .json({ message: 'An error occurred', error: err.toString() });
  }
};
