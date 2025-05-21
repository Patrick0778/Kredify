import crypto from 'crypto';
import { ApiError } from './error.js';
import { sendMail } from '../utils/email.js';
import logger from '../utils/logger.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Create a verification token
const generateVerificationToken = () => {
    // Generate a random token
    const token = crypto.randomBytes(32).toString('hex');

    // Create a hash of the token to store in the database
    const hashedToken = crypto
        .createHash('sha256')
        .update(token)
        .digest('hex');

    // Set token expiry to 24 hours
    const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    return {
        token,
        hashedToken,
        tokenExpires
    };
};

// Send verification email
export const sendVerificationEmail = async (user, req) => {
    try {
        logger.info(`Sending verification email to ${user.email}`);

        // Generate verification token
        const { token, hashedToken, tokenExpires } = generateVerificationToken();

        // Save the hashed token to the database
        await prisma.user.update({
            where: { id: user.id },
            data: {
                verificationToken: hashedToken,
                verificationTokenExpires: tokenExpires
            }
        });

        // Create verification URL
        const verificationURL = `${req.protocol}://${req.get('host')}/auth/verify-email/${token}`;

        // Create email message
        const message = `Welcome to Kredify! Please verify your email address by clicking on the following link: ${verificationURL}\n\nThis link will expire in 24 hours.`;

        // Create HTML email with modern design matching forgot password template
        const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Kredify Email</title>
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
            <h1>Welcome to Kredify!</h1>
          </div>
          <div class="email-body">
            <p>Hello,</p>
            <p>Thank you for registering with Kredify. We're excited to have you on board! Please verify your email address to complete your registration and access all features.</p>
            
            <p>Click the button below to verify your email address:</p>
            <div style="text-align: center;">
              <a href="${verificationURL}" class="btn">Verify My Email</a>
            </div>
            
            <div class="divider"></div>
            
            <p>Or copy and paste the following URL into your browser:</p>
            <p style="word-break: break-all; font-size: 14px; color: #666;">${verificationURL}</p>
            
            <p><small>This link will expire in 24 hours for security reasons.</small></p>
            
            <p>If you did not create an account, please ignore this email or contact our support team.</p>
            
            <p>Best regards,<br>The Kredify Team</p>
          </div>
          <div class="email-footer">
            <p>&copy; ${new Date().getFullYear()} Kredify. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

        // Send the email
        await sendMail({
            email: user.email,
            subject: 'Kredify - Email Verification',
            message,
            html
        });

        logger.info(`Verification email sent successfully to ${user.email}`);
        return true;
    } catch (error) {
        logger.error(`Failed to send verification email: ${error}`);
        throw new Error('Failed to send verification email');
    }
};

// Verify email handler
export const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params;

        logger.info('Email verification request received');

        // Hash the token from the URL
        const hashedToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        // Find the user with the token
        const user = await prisma.user.findFirst({
            where: {
                verificationToken: hashedToken,
                verificationTokenExpires: {
                    gt: new Date()
                }
            }
        });

        if (!user) {
            logger.warn('Invalid or expired verification token');
            return next(new ApiError(400, 'Your verification link is invalid or has expired'));
        }

        // Update user as verified
        await prisma.user.update({
            where: { id: user.id },
            data: {
                isEmailVerified: true,
                verificationToken: null,
                verificationTokenExpires: null
            }
        });

        logger.info(`Email verified successfully for user ${user.email}`);

        // Redirect to frontend with success message or render a success page
        res.status(200).json({
            status: 'success',
            message: 'Email verified successfully. You can now login.'
        });
    } catch (error) {
        logger.error(`Email verification error: ${error}`);
        next(new ApiError(500, 'An error occurred while verifying your email'));
    }
};

// Resend verification email
export const resendVerificationEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return next(new ApiError(400, 'Please provide your email address'));
        }

        // Find user
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }

        if (user.isEmailVerified) {
            return next(new ApiError(400, 'Email is already verified'));
        }

        // Send verification email
        await sendVerificationEmail(user, req);

        res.status(200).json({
            status: 'success',
            message: 'Verification email sent. Please check your inbox'
        });
    } catch (error) {
        logger.error(`Resend verification email error: ${error}`);
        next(new ApiError(500, 'Failed to resend verification email'));
    }
};

// Check email verification status
export const checkEmailVerificationStatus = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { isEmailVerified: true, email: true }
        });

        if (!user) {
            return next(new ApiError(404, 'User not found'));
        }

        res.status(200).json({
            status: 'success',
            data: {
                isEmailVerified: user.isEmailVerified,
                email: user.email
            }
        });
    } catch (error) {
        logger.error(`Check email verification status error: ${error}`);
        next(new ApiError(500, 'Failed to check email verification status'));
    }
};
