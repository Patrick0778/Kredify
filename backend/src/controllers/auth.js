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
    // Allow admins to bypass email verification requirement
    if (currUser.role === 'admin') {
      return next();
    }

    if (!currUser.isEmailVerified) {
      logger.warn(`Unverified email access attempt by user ID: ${req.user.id}`);
      return next(
        new ApiError(403, 'Please verify your email address to access this resource')
      );
    }

    // Email is verified, proceed
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

    // Create HTML email with modern design
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Kredify Password</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f7f8fa;
          }
          .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          }
          .email-header {
            background: linear-gradient(to right, #0033AD, #19CDD7);
            padding: 30px 20px;
            text-align: center;
          }
          .email-header h1 {
            color: #ffffff;
            margin: 0;
            font-size: 24px;
            font-weight: bold;
          }
          .email-body {
            padding: 30px 20px;
          }
          .email-footer {
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #666;
            background-color: #f7f8fa;
          }
          .btn {
            display: inline-block;
            background: linear-gradient(to right, #0033AD, #19CDD7);
            color: white;
            text-decoration: none;
            padding: 12px 30px;
            border-radius: 4px;
            margin-top: 20px;
            font-weight: bold;
            text-align: center;
          }
          .reset-token {
            background-color: #f7f8fa;
            border: 1px solid #e1e1e8;
            border-radius: 4px;
            padding: 12px;
            margin: 20px 0;
            font-family: monospace;
            font-size: 16px;
            color: #333;
            word-break: break-all;
            text-align: center;
          }
          .divider {
            height: 1px;
            background-color: #e1e1e8;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-header">
            <h1>Reset Your Kredify Password</h1>
          </div>
          <div class="email-body">
            <p>Hello,</p>
            <p>We received a request to reset your password for your Kredify account. If you didn't make this request, you can safely ignore this email.</p>
            
            <p><strong>Your password reset token is:</strong></p>
            <div class="reset-token">${resetToken}</div>
            
            <p>Click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="${resetURL}" class="btn">Reset Password</a>
            </div>
            
            <div class="divider"></div>
            
            <p>Or copy and paste the following URL into your browser:</p>
            <p style="word-break: break-all; font-size: 14px; color: #666;">${resetURL}</p>
            
            <p><small>This link will expire in 24 hours for security reasons.</small></p>
            
            <p>If you need further assistance, please contact our support team.</p>
            
            <p>Best regards,<br>The Kredify Team</p>
          </div>
          <div class="email-footer">
            <p>&copy; ${new Date().getFullYear()} Kredify. All rights reserved.</p>
            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendMail({
      email: user.email,
      subject: 'Reset Your Kredify Password',
      message,
      html,
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

    // Send verification email
    try {
      // Import here to avoid circular dependency
      const { sendVerificationEmail } = await import('./emailVerification.js');
      await sendVerificationEmail(newUser, req);
      logger.info(`Verification email sent to ${email}`);
    } catch (emailError) {
      logger.error(`Failed to send verification email: ${emailError}`);
      // Continue with registration even if email fails
    }

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
        message: 'User registered successfully. Please check your email to verify your account.',
        User: newUser,
        isEmailVerified: false,
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

    // Get the user including email verification status
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        password: true,
        email: true,
        username: true,
        role: true,
        isEmailVerified: true
      }
    });

    if (!user) {
      return next(new ApiError(401, 'User doesnt exist.'));
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return next(
        new ApiError(401, 'Invalid credentials. Check them and try again.')
      );
    }

    // Check if email is verified (allow admin login without verification)
    if (!user.isEmailVerified && user.role !== 'admin') {
      // Import verifyEmail controller to use sendVerificationEmail function
      try {
        const { sendVerificationEmail } = await import('./emailVerification.js');
        await sendVerificationEmail(user, req);
      } catch (emailError) {
        logger.error(`Failed to resend verification email: ${emailError}`);
      }

      return next(
        new ApiError(401, 'Please verify your email address first. A new verification email has been sent.')
      );
    }

    //Sign the jwt token for the user
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