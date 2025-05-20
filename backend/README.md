# Kredify Backend API

## Overview

Kredify is a comprehensive backend platform providing:

1. User authentication with JWT-based security
2. File storage and management with AWS S3 integration
3. Cardano blockchain integration for NFT minting
4. PostgreSQL database powered by Prisma ORM

## API Features

### Authentication

- **User Registration**: `POST /auth/register`

  - Regular user registration with email and password
  - Secure password hashing with bcrypt

- **Admin Registration**: `POST /auth/admin/register`

  - Special endpoint for admin user creation

- **Login**: `POST /auth/login`

  - Returns a JWT token for authenticated API access

- **Logout**: `GET /auth/logout`

  - Invalidates the current session

- **Password Management**:
  - Forgot password: `PATCH /auth/forgotpassword`
  - Reset password: `PATCH /auth/resetpassword`
  - Update password: `PATCH /auth/updatepassword`

### User Management

- **User Profile**: `GET /user/profile`
  - Retrieve authenticated user's profile
- **All Users**: `GET /user`

  - Admin access to list all users with pagination

- **User Search**: `GET /user/search?name=query`

  - Search users by name or username

- **Delete User**: `DELETE /user/delete`
  - Remove user account and associated data

### File Management

- **File Upload**: `POST /files/upload`
  - Secure file upload with type validation
  - Supports images and PDFs
  - Files stored in AWS S3 with IPFS integration
- **File Retrieval**:
  - By type: `GET /files/:type` - Get files by category (images/PDFs)
  - By name: `GET /files/file/:filename` - Get specific file

### Cardano Blockchain Integration

- **Token Minting**: `POST /mint/mint`
  - Mint NFTs on Cardano testnet/mainnet
  - Uses Blockfrost API for blockchain interactions

## Setup Instructions

1. Clone the repository and install dependencies:

   ```bash
   git clone <repository-url>
   cd Kredify/backend
   npm install
   ```

2. Set up environment variables:

   - Create a `.env` file based on the provided example
   - Configure your PostgreSQL database connection
   - Add your AWS S3 credentials
   - Set your Blockfrost API key for Cardano integration

3. Run database migrations:

   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

5. For production:

   ```bash
   npm start
   ```

## API Testing

A Postman collection is included for easy API testing:

1. Import `postman_collection.json` into Postman
2. Set up environment variables:
   - `baseUrl`: `http://localhost:5000`
   - `authToken`: JWT token received after login

## Project Structure

- `src/`

  - `index.js` - Main application entry point
  - `controllers/` - Request handling logic
  - `routes/` - API endpoint definitions
  - `utils/` - Helper functions and utilities
  - `logs/` - Application logs

- `prisma/` - Database schema and migrations
- `uploads/` - Temporary file storage

## Key Technologies

- **Node.js & Express**: API framework
- **PostgreSQL & Prisma ORM**: Database layer
- **JWT**: Authentication
- **AWS S3**: File storage
- **Blockfrost API**: Cardano blockchain integration
- **Winston**: Logging

## Cardano Blockchain Integration

This backend uses [Blockfrost API](https://blockfrost.io/) for all Cardano blockchain interactions:

- **Configuration**:

  - Set your Blockfrost API key in the `.env` file
  - Choose network (mainnet/testnet) in the mintController.js file

- **Features**:
  - Token minting and NFT creation
  - Metadata handling with IPFS integration
  - Transaction submission

## Environment Variables

```
PORT = 5000
CLIENT_URL = "http://localhost:5173"
DATABASE_URL = "postgresql://postgres:password@localhost:5432/kredify?schema=public"
JWT_PRIVATE_KEY = "your_jwt_secret_key"
BLOCKFROST_API_KEY = "your_blockfrost_api_key"
AWS_REGION = "your_aws_region"
AWS_ACCESS_KEY_ID = "your_aws_access_key"
AWS_SECRET_ACCESS_KEY = "your_aws_secret_key"
S3_BUCKET_NAME = "your_bucket_name"
EMAIL_HOST = "smtp.example.com"
EMAIL_PORT = 587
EMAIL_USERNAME = "your_email@example.com"
EMAIL_PASSWORD = "your_email_password"
```

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting for API protection
- HTTP security headers with Helmet
- CORS configuration

## Error Handling & Logging

- Centralized error handling
- Winston logger with file and console output
- Detailed error messages for development

## Contributing

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

## License

This project is licensed under the ISC License.
