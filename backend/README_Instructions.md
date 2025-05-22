# Loom Demo Preparation – Kredify

## Summary of Adjustments for Demo

1. **Aiken Policy Script**

   - Compiled the Aiken contract (`credential_nft_validator.ak`) for NFT minting. Ensure the compiled `.plutus` or `.cbor` file is available and its path is referenced in the backend mint endpoint.

2. **Backend Adjustments**

   - `/files/upload` endpoint uploads files to IPFS and returns the hash and metadata.
   - `/mint/mint` endpoint mints NFTs using the institution signing key (`Muk_key_uni.skey`).
   - Backend uses a constant institution signing key for all minting.
   - The `policyScriptPath` in the mint endpoint must match the compiled Aiken policy file path.
   - Error handling and endpoint testing confirmed.

3. **Frontend Adjustments**

   - State for `ipfsHash`, `credentialMetadata`, and error handling added in `create-credential-steps.tsx`.
   - Defined a `CredentialMetadata` interface for type safety.
   - `handleFileUpload` calls the backend and stores IPFS hash and metadata.
   - `handleSubmit` calls the backend mint endpoint, passing the correct parameters and displaying the transaction hash.
   - UI feedback for upload and minting (loading, error, and success states) implemented.
   - Ensure the recipient Cardano address and policy script path are set correctly in the frontend.

4. **Demo Script**

   - Test the full flow: upload a PDF/image, enter metadata, mint the NFT, and display the transaction hash.
   - Show the NFT on Cardano explorer using the transaction hash.

5. **Final Checklist**
   - [x] Aiken contract compiled and path known.
   - [x] Backend endpoints tested and working.
   - [x] Frontend can upload, mint, and display results.
   - [x] All error messages are user-friendly.
   - [x] Demo script ready.

---

**You are now ready to record your Loom demo!**

- Show the upload, metadata, and minting steps.
- Show the minted NFT and transaction hash.
- (Optional) Show the NFT on Cardano explorer.

---

**If you need to change the recipient address or policy script path for your demo, update those values in your frontend code.**

---

# Kredify Backend – System Overview & Implementation Instructions

This document outlines the architecture and implementation steps for building a blockchain-based credential issuance and verification system using Cardano, IPFS, and Aiken smart contracts.

---

## 1. Backend Enhancements

### a. Credential Upload & Metadata Automation

- **Automate file upload to IPFS** (already discussed).
- **Generate standardized credential metadata** (CIP-25 or custom schema).
- **Store metadata and IPFS hash in your database** for audit and retrieval.

### b. Smart Contract (Aiken) Integration

- **Compile and deploy Aiken smart contracts** for credential minting and verification.
- **Backend should interact with Aiken contracts** (e.g., via Lucid or Mesh SDK) to:
  - Mint credential NFTs referencing the IPFS metadata.
  - Enforce institution signatures/authorization in the contract logic.
  - Optionally, allow revocation or updates (if your contract supports it).

### c. Verification Endpoint

- **Create an endpoint for employers/institutions to verify credentials:**
  - Accept a credential NFT ID or hash.
  - Fetch on-chain metadata and validate via the Aiken contract.
  - Optionally, cross-check with your backend database for additional info.

---

## 2. Frontend Enhancements

### Credential Issuance Portal

- For institutions to upload credentials, sign, and mint via the smart contract.

### Verification Portal

- For employers to input a credential hash/NFT and get instant verification status.

---

## 3. Database Schema Updates

### Track issued credentials:

- Store credential metadata, IPFS hash, NFT ID, issuing institution, student info, and status (active/revoked).

---

## 4. Security & Authorization

### Institution Authentication:

- Only authorized institutions can mint credentials (enforced both in backend and Aiken contract).
- JWT or OAuth for institution login.

---

## 5. Aiken Smart Contract Design

- **Credential Minting Policy:** Only allow minting if the transaction is signed by an authorized institution.
- **Metadata Validation:** Optionally, validate structure or required fields in the contract.
- **Revocation Logic:** If needed, allow revocation by the issuer.

---

## 6. Example Workflow

1. Institution logs in to the portal.
2. Uploads credential file (image/PDF).
3. Backend uploads to IPFS and generates metadata.
4. Backend/Frontend builds a mint transaction referencing the metadata.
5. Aiken contract enforces minting policy (e.g., only institution can mint).
6. Credential NFT is minted on Cardano.
7. Verification portal allows anyone to check the NFT and metadata on-chain.

---

## 7. Suggested Tech Stack

- **Backend:** Node.js/Express, Prisma (PostgreSQL), IPFS SDK, Blockfrost SDK, Lucid/Mesh SDK for Cardano, Aiken for smart contracts.
- **Frontend:** React (with wallet integration for signing).
- **Smart Contracts:** Aiken (compiled and deployed to Cardano).

---

## Summary Table

| Area            | Modification/Integration Needed                                |
| --------------- | -------------------------------------------------------------- |
| File Handling   | Automate IPFS upload, metadata creation                        |
| Smart Contracts | Use Aiken for minting/verification, enforce institution policy |
| Minting         | Use Lucid/Mesh SDK to interact with Aiken contract             |
| Verification    | Endpoint/portal for on-chain credential validation             |
| Security        | Auth for institutions, contract-level signature checks         |
| Database        | Store credential, NFT, issuer, status                          |

---

If you want code samples for any of these steps (e.g., Aiken contract, backend minting logic, verification endpoint), let me know!
