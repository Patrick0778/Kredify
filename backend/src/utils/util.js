import { fileURLToPath } from 'url';
import jwt from 'jsonwebtoken';
import path from 'path';
import rateLimit from 'express-rate-limit';

export const getDirname = (moduleUrl) => {
  return path.dirname(fileURLToPath(moduleUrl));
};

export const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_PRIVATE_KEY);
};


export const limiter = rateLimit({
  limit: 150000, // Limit each IP to 150000 requests per window
  windowMs: 60 * 60 * 1000, // 1 hour window
  message: 'Too many requests from this IP, Please try again in an hour',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})
