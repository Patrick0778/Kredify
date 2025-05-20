import { Router } from 'express';
import { authRouter } from '../routes/auth.js';
import { userRouter } from '../routes/users.js';
import { filesRouter } from '../routes/files.js';
import { mintRouter } from '../routes/mint.js';

const router = Router();
router.use('/auth', authRouter);
router.use('/user', userRouter);

// File upload and retrieval endpoints
router.use('/files', filesRouter);

// Cardano minting endpoint
router.use('/mint', mintRouter);

export default router;