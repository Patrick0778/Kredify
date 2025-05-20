import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import fs from 'fs';
import path from 'path';
import { ApiError } from './error.js';
import logger from '../utils/logger.js';

let blockfrost;
// Initialize blockfrost only if API key is available
try {
    if (process.env.BLOCKFROST_API_KEY) {
        blockfrost = new BlockFrostAPI({
            projectId: process.env.BLOCKFROST_API_KEY,
            network: 'mainnet', // Using testnet for development and testing
        });
    }
} catch (error) {
    logger.error('Error initializing Blockfrost API:', error);
}

export const mintToken = async (req, res, next) => {
    // Check if blockfrost is initialized
    if (!blockfrost) {
        logger.error('Blockfrost API not initialized. Missing API key.');
        return next(new ApiError(500, 'Cardano minting service not configured. Please configure BLOCKFROST_API_KEY.'));
    }

    const { policyId, tokenName, metadata, signingKeyPath } = req.body;
    if (!policyId || !tokenName || !metadata || !signingKeyPath) {
        return next(new ApiError(400, 'Missing required minting parameters.'));
    }

    try {
        const signingKey = fs.readFileSync(signingKeyPath, 'utf8');
        const tx = { policyId, tokenName, metadata, signingKey };
        // This is a placeholder. Actual Cardano minting requires more steps.
        const response = await blockfrost.submitTransaction(tx);
        res.status(200).json({ message: 'Transaction submitted', response });
    } catch (error) {
        logger.error('Error minting token:', error);
        next(new ApiError(500, 'Error minting token.'));
    }
};
