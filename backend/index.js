const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
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
    cb(new Error('Only images and PDFs are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Middleware to parse JSON
app.use(express.json());

// File upload endpoint
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  res.status(200).json({
    message: 'File uploaded successfully!',
    file: req.file,
  });
});

// Retrieve files by type
app.get('/files/:type', (req, res) => {
  const fileType = req.params.type;
  const allowedTypes = ['images', 'pdfs'];

  if (!allowedTypes.includes(fileType)) {
    return res.status(400).json({ message: 'Invalid file type. Use "images" or "pdfs".' });
  }

  const folderPath = path.join(__dirname, 'uploads');
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      return res.status(500).json({ message: 'Error reading files.' });
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
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});