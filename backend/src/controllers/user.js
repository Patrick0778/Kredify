import { ApiError } from './error.js';
import logger from '../utils/logger.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const allUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
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
