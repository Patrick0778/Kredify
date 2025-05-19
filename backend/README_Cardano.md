# Verifying Credentials on the Cardano Blockchain

## Overview
This document explains how to verify credentials issued as minted tokens on the Cardano blockchain.

## Steps to Verify Credentials

### 1. Mint Credentials as Tokens
- Credentials are issued as native tokens on the Cardano blockchain.
- Each token represents a unique credential.
- Metadata is attached to the token to describe the credential (e.g., issuer, recipient, validity).

### 2. Store Metadata
- Use Cardano's transaction metadata to store credential details.
  - Example: Issuer's name, recipient's name, and expiration date.
- For larger data, store it off-chain (e.g., in IPFS) and include a reference (e.g., IPFS hash) in the metadata.

### 3. Verify Ownership
- To verify a credential, check if the recipient's wallet holds the token representing the credential.
- Use Cardano APIs (e.g., Blockfrost) to query the blockchain for token ownership.

### 4. Validate Metadata
- Retrieve the metadata associated with the token to ensure the credential's authenticity and validity.
- Compare the metadata with the expected values (e.g., issuer's signature, expiration date).

### 5. Integrate with Your Backend
- Add an endpoint to your backend to verify credentials:
  - Accept the token ID and recipient's wallet address as input.
  - Query the blockchain to confirm ownership and validate metadata.

### 6. Use Cardano SDKs
- Use libraries like `cardano-serialization-lib` or APIs like Blockfrost to interact with the Cardano blockchain programmatically.

## Tools and Libraries
- **Blockfrost API**: Simplifies interaction with the Cardano blockchain.
- **cardano-serialization-lib**: A JavaScript library for Cardano blockchain operations.

## Example Workflow
1. **Issuer**: Mints a token representing the credential and sends it to the recipient's wallet.
2. **Recipient**: Holds the token in their wallet.
3. **Verifier**: Queries the blockchain to confirm token ownership and validate metadata.
4. **Recipient**: Can view verified tokens a jpegs or IPFS files.

## Security Considerations
- Ensure sensitive data is encrypted before storing it on-chain or off-chain.
- Follow best practices for handling private keys and wallet interactions.

## Next Steps
- Set up a Cardano node or use Blockfrost to interact with the blockchain.
- Implement the minting and verification processes in your backend.