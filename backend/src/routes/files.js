import express from 'express';
import { upload, uploadFile, getFilesByType, getFileByName } from '../controllers/fileController.js';

const router = express.Router();

// POST /files/upload
router.post('/upload', upload.single('file'), uploadFile);
// GET /files/:type
router.get('/:type', getFilesByType);
// GET /files/file/:filename
router.get('/file/:filename', getFileByName);

export { router as filesRouter };
