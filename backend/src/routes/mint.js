import express from 'express';
import { mintToken } from '../controllers/mintController.js';

const router = express.Router();

// POST /mint
router.post('/mint', mintToken);

export { router as mintRouter };
