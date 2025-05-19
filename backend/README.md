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

## Cardano Blockchain Integration

This backend uses the [Blockfrost API](https://blockfrost.io/) for all Cardano blockchain interactions. You do NOT need to run or download a local `cardano-node.zip` file.

- All Cardano transactions, queries, and NFT minting are performed via Blockfrost endpoints and SDKs.
- You must set your Blockfrost API key in the environment variables (see `.env.example`).

### Smart Contracts with Aiken

- Smart contracts are written and compiled using [Aiken](https://aiken-lang.org/).
- The compiled Plutus scripts are used for on-chain validation and referenced in Cardano transactions via Blockfrost.
- See the `contracts/credential-contract/` directory for Aiken contract sources and build artifacts.

---

## Cardano Node Binary (No Longer Required)

You do NOT need to download or use `cardano-node.zip` for this backend. All blockchain features are handled via Blockfrost and Aiken.

---

## Future Updates

This README will be updated as new features or changes are implemented.
