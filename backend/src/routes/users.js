import express from 'express';
import { allUsers, delUser, searchUser, userProfile } from '../controllers/user.js';
import { protect } from '../controllers/auth.js';

const router = express.Router();

// Routes that require just authentication
router.get('/profile', protect, userProfile);

// Routes that require both authentication and email verification
router.get('/', protect, allUsers);
router.delete('/delete', protect, delUser);
router.get('/search', protect, searchUser);

export { router as userRouter };