# Kredify Backend

This is the backend service for the Kredify application. It provides API endpoints and logic for credential verification, user management, and blockchain interactions.

## Features

- RESTful API for credential management
- Integration with Cardano blockchain for minting and verifying credentials
- Secure handling of user data and authentication
- Supports file uploads for credential documents

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file with the required environment variables (see `.env.example` if available).
3. Start the backend server:
   ```bash
   npm start
   ```

## Project Structure

- `index.js` - Main entry point for the backend server
- `public/` - Static assets
- `README.md` - Project documentation

## API Endpoints

- `POST /api/credentials` - Upload and mint a new credential
- `GET /api/credentials/:id` - Retrieve credential details
- `POST /api/verify` - Verify a credential

## License

MIT License
