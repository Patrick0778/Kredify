import multer from 'multer';
import path from 'path';
import fs from 'fs';
import axios from 'axios';
import FormData from 'form-data';
import { ApiError } from './error.js';
import logger from '../utils/logger.js';

// Ensure uploads directory exists
const uploadsDir = path.resolve('uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer storage and filter
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new ApiError(400, 'Only images and PDFs are allowed!'), false);
    }
};

export const upload = multer({ storage, fileFilter });

// Upload file to IPFS via Pinata
async function uploadFileToIPFS(filePath) {
    const data = new FormData();
    data.append('file', fs.createReadStream(filePath));

    const res = await axios.post(
        'https://api.pinata.cloud/pinning/pinFileToIPFS',
        data,
        {
            maxContentLength: 'Infinity',
            headers: {
                ...data.getHeaders(),
                pinata_api_key: process.env.PINATA_API_KEY,
                pinata_secret_api_key: process.env.PINATA_SECRET_API_KEY,
            },
        }
    );
    return res.data.IpfsHash;
}

function createCredentialMetadata(ipfsHash, originalFileName, extraAttributes = {}) {
    return {
        name: `Credential - ${originalFileName}`,
        image: `ipfs://${ipfsHash}`,
        mediaType: 'image/jpeg', // or 'application/pdf' based on file type
        ...extraAttributes,
    };
}

export const uploadFile = async (req, res, next) => {
    if (!req.file) {
        return next(new ApiError(400, 'No file uploaded.'));
    }
    try {
        const ipfsHash = await uploadFileToIPFS(req.file.path);
        const ext = path.extname(req.file.originalname).toLowerCase();
        const mediaType = ['.jpg', '.jpeg', '.png'].includes(ext)
            ? 'image/jpeg'
            : 'application/pdf';
        const metadata = createCredentialMetadata(ipfsHash, req.file.originalname, { mediaType });
        res.status(200).json({
            message: 'File uploaded and metadata created!',
            ipfsHash,
            metadata,
        });
    } catch (err) {
        logger.error('IPFS upload or metadata creation failed', err);
        next(new ApiError(500, 'IPFS upload or metadata creation failed.'));
    }
};

export const getFilesByType = (req, res, next) => {
    const fileType = req.params.type;
    const allowedTypes = ['images', 'pdfs'];
    if (!allowedTypes.includes(fileType)) {
        return next(new ApiError(400, 'Invalid file type. Use "images" or "pdfs".'));
    }
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return next(new ApiError(500, 'Error reading files.'));
        }
        const filteredFiles = files.filter((file) => {
            const ext = path.extname(file).toLowerCase();
            if (fileType === 'images') {
                return ['.jpg', '.jpeg', '.png'].includes(ext);
            } else if (fileType === 'pdfs') {
                return ext === '.pdf';
            }
        });
        res.status(200).json({ files: filteredFiles });
    });
};

export const getFileByName = (req, res, next) => {
    const filename = req.params.filename;
    const filePath = path.join(uploadsDir, filename);
    if (!fs.existsSync(filePath)) {
        return next(new ApiError(404, 'File not found.'));
    }
    res.sendFile(filePath);
};
