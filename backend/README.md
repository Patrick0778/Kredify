# Backend for File Storage and User Authentication

## Overview

This backend provides functionality for:

1. File uploads (images and PDFs only).
2. Retrieving files by type (images or PDFs).
3. User registration with email and password.
4. User login with email and password verification.

## Features

### File Uploads

- **Endpoint**: `POST /upload`
- **Description**: Allows users to upload files.
- **Allowed File Types**: Images (`.jpg`, `.jpeg`, `.png`) and PDFs (`.pdf`).
- **Key**: `file` (in form-data).
- **Storage**: Files are stored in the `uploads/` directory.

### Retrieve Files by Type

- **Endpoint**: `GET /files/:type`
- **Description**: Retrieves files based on their type.
- **Parameters**:
  - `:type`: Either `images` or `pdfs`.
- **Response**: A list of files matching the specified type.

### User Registration

- **Endpoint**: `POST /register`
- **Description**: Registers a new user with email and password.
- **Validation**:
  - Email must be unique.
  - Passwords are hashed before storage.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: Success or error message.

### User Login

- **Endpoint**: `POST /login`
- **Description**: Authenticates a user with email and password.
- **Request Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "securepassword"
  }
  ```
- **Response**: Success or error message.

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the server:
   ```bash
   node index.js
   ```
3. The server runs on `http://localhost:3000`.

## Folder Structure

- `index.js`: Main server file.
- `package.json`: Project metadata and dependencies.
- `uploads/`: Directory for storing uploaded files.

## Dependencies

- `express`: Web framework for Node.js.
- `multer`: Middleware for handling file uploads.
- `bcrypt`: Library for hashing passwords.
- `sqlite3`: SQLite database library.

## Cardano Node Binary

The Cardano node binary (`cardano-node.zip`) is **not included** in this repository due to GitHub's file size restrictions. To use Cardano blockchain features, you must manually download and place the file:

1. Download `cardano-node.zip` from the official Cardano release page or your team's shared storage.
2. Place the file in the `backend/` directory so the structure is:
   ```
   backend/
     cardano-node.zip
     ...
   ```
3. Unzip the file if required and follow any additional setup instructions in `README_Cardano.md`.

**Note:** Do not attempt to commit this file to git. It is ignored via `.gitignore`.

## Future Updates

This README will be updated as new features or changes are implemented.
