const { BlockFrostAPI } = require('@blockfrost/blockfrost-js');
const fs = require('fs');
const path = require('path');

const blockfrost = new BlockFrostAPI({
  projectId: 'preprodSPgkvX439vm3WZ7s61Cl4wKovfnN45y4', // Replace with your Blockfrost API key
});

async function mintToken(policyId, tokenName, metadata, signingKeyPath) {
  try {
    // Load the signing key
    const signingKey = fs.readFileSync(signingKeyPath, 'utf8');

    // Construct the transaction for minting
    const tx = {
      policyId,
      tokenName,
      metadata,
      signingKey,
    };

    // Submit the transaction
    const response = await blockfrost.submitTransaction(tx);
    console.log('Transaction submitted:', response);
  } catch (error) {
    console.error('Error minting token:', error);
  }
}

// Example usage
const policyId = 'your_policy_id'; // Replace with your policy ID
const tokenName = 'credential_token';
const metadata = {
  issuer: 'Issuer Name',
  recipient: 'Recipient Name',
  status: 'pending',
};
const signingKeyPath = path.join(__dirname, 'keys/payment.skey'); // Path to the signing key

mintToken(policyId, tokenName, metadata, signingKeyPath);