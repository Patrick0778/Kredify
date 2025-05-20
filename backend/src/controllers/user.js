import { ApiError } from './error.js';
import logger from '../utils/logger.js';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  region: process.env.AWS_REGION
});

export const allUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    for (const user of users) {
      if (user.image) {
        const command = new GetObjectCommand({
          Bucket: process.env.S3_BUCKET_NAME,
          Key: user.image
        });
        const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
        user.image = url;
      }
    }
    res.json({
      Users: users.length,
      data: users
    });
  } catch (error) {
    logger.error(`An error occurred while fetching users: ${error}`);
    res.status(500).send(new ApiError(500, 'An error occurred while fetching users.'));
  }
};

export const userProfile = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await prisma.user.findUnique({
      where: {
        id: userId
      }
    });
    if (user.image) {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: user.image
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      user.image = url;
    }
    res.json(user);
  } catch (error) {
    logger.error(`An error occurred while fetching user profile: ${error}`);
    res.status(500).send(new ApiError(500, 'An error occurred while fetching user profile.'));
  }
};

export const delUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    logger.info(`Deleting user with id ${userId}`);
    const deletedUser = await prisma.user.delete({
      where: {
        id: userId
      }
    });
    if (!deletedUser) {
      logger.warn(`User with id ${userId} not found`);
      return res.status(404).json({ message: 'User not found.' });
    }
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: deletedUser.image
    }));
    logger.info(`Deleted user with id ${userId}`);
    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    logger.error(`An error occurred while deleting the user: ${error}`);
    res.status(500).send(new ApiError(500, 'An error occurred while deleting the user.'));
  }
};

export const searchUser = async (req, res) => {
  try {
    const query = req.query.name;
    logger.info(`Searching for user with name ${query}`);
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { username: { contains: query } },
          { firstName: { contains: query } },
          { lastName: { contains: query } },
        ]
      }
    });
    for (const user of users) {
      const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: user.image
      });
      const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
      user.image = url;
    }

    if (users.length === 0) {
      logger.warn(`User with name ${query} not found`);
      return res.status(404).json({ message: 'User not found.' });
    }
    logger.info(`Found user with name ${query}`);
    res.json(users);
  } catch (error) {
    logger.error(`An error occurred while searching for the user: ${error}`);
    res.status(500).send(new ApiError(500, 'An error occurred while searching for the user.'));
  }
};
