import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { promisify } from 'util';
import { ApiError } from './error.js';
import { sendMail } from '../utils/email.js';
import { signToken } from '../utils/util.js';
import logger from '../utils/logger.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient().$extends({
  query: {
    user: {
      async $allOperations({ operation, args, query }) {
        if (['create', 'update'].includes(operation) && args.data['password']) {
          args.data['password'] = await bcrypt.hash(args.data['password'], 12)
        }
        return query(args)
      }
    }
  }
})

// Middleware to protect routes - checks if the user is authenticated
export const protect = async (req, res, next) => {
  try {
    logger.info('Protect middleware invoked');
    let token;
    // Check if the authorization header contains a Bearer token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies) {
      // If no Bearer token, check for token in cookies
      token = req.cookies.jwt;
    }

    if (!token) {
      // If no token found, return unauthorized error
      return next(
        new ApiError(
          401,
          'You are not logged in. Please log in to get access...'
        )
      );
    }

    // Verify the JWT token
    const decoded = await promisify(jwt.verify)(
      token,
      process.env.JWT_PRIVATE_KEY
    );

    // Find the user based on the decoded ID from the token
    const currUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, password: true },
    });
    if (!currUser) {
      // If user not found, return unauthorized error
      return next(new ApiError(401, 'Token no longer exists...'));
    }

    // Check if user changed their password after the token was issued
    if (currUser.passChangedAt) {
      const changedTimestamp = parseInt(currUser.passChangedAt.getTime() / 1000, 10);
      if (decoded.iat < changedTimestamp) {
        return next(new ApiError(401, 'Password changed. Log in again...'));
      }
    }

    // Attach the current user to the request object
    req.user = currUser;
    next();
  } catch (error) {
    logger.error(`Protect middleware error: ${error}`);
    next(new ApiError(500, error.message));
  }
};

// Middleware to restrict access based on user roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    logger.info(`RestrictTo middleware invoked with roles: ${roles}`);
    if (!roles.includes(req.user.role)) {
      // If user's role is not allowed, return forbidden error
      return next(
        new ApiError(403, 'You are not allowed to access this route.')
      );
    }
    next();
  };
};

// Handler for forgot password request
export const forgotpassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    logger.info(`Forgot password handler invoked for email: ${email}`);
    // Get user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new ApiError(404, 'Email doesnt belong to any account..'));
    }

    //Generate reset password token

    const resetToken = crypto.randomBytes(16).toString('hex');
    const passresettoken = crypto.createHash('sha256', 8).update(resetToken).digest('hex');

    await prisma.user.update({ where: { id: user.id }, data: { passresettoken } });

    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/auth/resetpassword/${resetToken}`;

    const message = `Forgot your password?\nCopy and paste this code\n${resetToken} \n\nReset your password or Submit a patch request with new password to \n${resetURL}\nIf you didnt forget password please ignore this email`;

    await sendMail({
      email: user.email,
      subject: 'Password Reset Token',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email',
    });
  } catch (error) {
    logger.error(`Forgot password error: ${error}`);
    return next(new ApiError(500, error.message));
  }
};

// Handler for resetting user password
export const resetpassword = async (req, res, next) => {
  try {
    logger.info('Reset password handler invoked');
    const hashedtoken = crypto
      .createHash('sha256')
      .update(req.body.token)
      .digest('hex');
    const user = await prisma.user.findUnique({ where: { passresettoken: hashedtoken } });
    if (!user) {
      return next(new ApiError(400, 'Token invalid or expired'));
    }
    await prisma.user.update({ where: { id: user.id }, data: { password: req.body.password, passresettoken: null } });

    const token = signToken(user.id);

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully....',
      token,
      UserId: user.id,
    });
  } catch (error) {
    logger.error(`Reset password error: ${error}`);
    return next(new ApiError(500, error.message));
  }
};

// Handler for updating user password
export const updatepassword = async (req, res, next) => {
  try {
    logger.info('Update password handler invoked');
    const { oldpassword, newpassword } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!(await bcrypt.compare(oldpassword, user.password))) {
      return next(
        new ApiError(401, 'Incorrect password. Check it and try again.')
      );
    }
    await prisma.user.update({ where: { id: req.user.id }, data: { password: newpassword, passwordChangedAt: new Date() } });

    const access_token = signToken(req.user.id);

    res
      .status(200)
      .cookie('jwt', access_token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      })
      .json({
        message: 'Password successfully updated.',
      });
  } catch (error) {
    logger.error(`Update password error: ${error}`);
    next(new ApiError(500, error.message));
  }
};

// Handler for user registration
export const Register = async (req, res, next) => {
  try {
    logger.info('Register handler invoked');
    const { username, email, password } = req.body;

    const checkemail = await prisma.user.findUnique({ where: { email } });
    if (checkemail) {
      return next(
        new ApiError(401, 'Email already taken. Use a different one.')
      );
    }
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password,
      },
    });

    const access_token = signToken(newUser.id);

    res
      .status(201)
      .cookie('jwt', access_token, {
        httpOnly: true,
        secure: true,
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      })
      .json({
        status: 'success',
        message: 'User registered successfully.',
        User: newUser,
      });
    logger.info(
      `User ${newUser.username} registered successfully.`
    );
  } catch (error) {
    logger.error(`Register error: ${error}`);
    next(new ApiError(500, error.message));
  }
};

// Handler for admin user registration
export const AdminRegister = async (req, res, next) => {
  try {
    logger.info('Admin register handler invoked');
    const { username, email, password } = req.body;

    const checkemail = await prisma.user.findUnique({ where: { email } });
    if (checkemail) {
      return next(
        new ApiError(401, 'Email already taken. Use a different one.')
      );
    }

    const newAdmin = await prisma.user.create({
      data: {
        username,
        email,
        role: 'admin',
        password,
      },
    });

    const access_token = signToken(newAdmin.id);

    res
      .status(201)
      .cookie('jwt', access_token, {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      })
      .json({
        status: 'success',
        message: 'User registered successfully.',
        User: newAdmin
      });
    logger.info(
      `Admin ${newAdmin.username.toUpperCase()} registered successfully.`
    );
  } catch (error) {
    logger.error(`Admin register error: ${error}`);
    next(new ApiError(500, error.message));
  }
};

// Handler for user login
export const Login = async (req, res, next) => {
  try {
    logger.info('Login handler invoked');
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return next(new ApiError(401, 'User doesnt exist........'));
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return next(
        new ApiError(401, 'Invalid credentials. Check them and try again.')
      );
    }
    //Sign the jwt token for the user..
    const access_token = signToken(user.id);

    res
      .status(200)
      .cookie('jwt', access_token, {
        expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,
      })
      .json({
        status: 'success',
        message: `Logged in as ${user.username.toUpperCase()}`,
        user,
      });
    logger.info(`User ${user.username.toUpperCase()} logged in successfully.`);
  } catch (error) {
    logger.error(`Login error: ${error}`);
    return next(new ApiError(500, error.message));
  }
};

export const isAuthenticated = async (req, res, next) => {
  try {
    // Since this is after the protect middleware, we already have the user
    const user = req.user;

    // Return both the user data and the current token
    res.status(200).json({
      status: "success",
      message: "User is authenticated",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      // Send back the same token to refresh its expiry
      token: req.cookies.jwt || req.headers.authorization?.split(" ")[1],
    });
  } catch (error) {
    logger.error(`Authentication error: ${error}`);
    return next(new ApiError(500, error.message));
  }
};


// Function to log out a user
export const Logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
};