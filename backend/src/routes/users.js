import express from 'express';
import { allUsers, delUser, searchUser, userProfile } from '../controllers/user.js';
import { protect } from '../controllers/auth.js';

const router = express.Router();

router.get('/', protect, allUsers);
router.get('/profile', protect, userProfile);
router.delete('/delete', protect, delUser);
router.get('/search', protect, searchUser);

export { router as userRouter };