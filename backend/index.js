const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3000;

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Initialize SQLite database
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )`);
});

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

// Register endpoint
app.post('/register', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (email, password) VALUES (?, ?)',
      [email, hashedPassword],
      function (err) {
        if (err) {
          if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ message: 'Email already exists.' });
          }
          return res.status(500).json({ message: 'Error registering user.' });
        }

        res.status(201).json({ message: 'User registered successfully!' });
      }
    );
  } catch (error) {
    res.status(500).json({ message: 'Error hashing password.' });
  }
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }
  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ message: 'Database error.' });
    if (!user) return res.status(401).json({ message: 'Invalid credentials.' });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials.' });
    res.status(200).json({ message: 'Login successful.' });
  });
});

// Helper endpoint to get a single file by name (optional, for completeness)
app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', filename);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ message: 'File not found.' });
  }
  res.sendFile(filePath);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});