import express from 'express';
import {
  AdminRegister,
  Login,
  Logout,
  Register,
  forgotpassword,
  protect,
  resetpassword,
  updatepassword,
} from '../controllers/auth.js';
import { ApiError } from '../controllers/error.js';
import {
  verifyEmail,
  resendVerificationEmail,
  checkEmailVerificationStatus
} from '../controllers/emailVerification.js';

const router = express.Router();

// Authentication routes
router.post('/register', Register);
router.post('/admin/register', AdminRegister);
router.post('/login', Login);
router.get('/logout', Logout);
router.patch('/forgotpassword', forgotpassword);
router.patch('/updatepassword', protect, updatepassword);
router.patch('/resetpassword', resetpassword);

// Email verification routes
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.get('/verification-status', protect, checkEmailVerificationStatus);

router.all('*', (req, res, next) => {
  next(
    new ApiError(404, `Oooops!! Can't find ${req.originalUrl} on this server!`)
  );
});

export { router as authRouter };
