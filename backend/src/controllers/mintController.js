import { Lucid, Blockfrost, fromText, toUnit, Data } from "lucid-cardano";
//import csl from     @emurgo/cardano-serialization-lib-nodejs";
import fs from "fs";
import path from "path";
import { ApiError } from "./error.js";
import logger from "../utils/logger.js";

// Set your institution's signing key path here (absolute path or relative to backend directory)
const INSTITUTION_SIGNING_KEY_PATH = path.resolve(
  __dirname,
  "../../Muk_key_uni.skey"
);

// Helper to load compiled Aiken script
function loadPolicyScript(scriptPath) {
  const scriptCbor = fs.readFileSync(scriptPath, "utf8");
  return { type: "PlutusV2", script: scriptCbor };
}

export const mintToken = async (req, res, next) => {
  const { policyScriptPath, tokenName, metadata, recipientAddress } = req.body;
  if (!policyScriptPath || !tokenName || !metadata || !recipientAddress) {
    return next(new ApiError(400, "Missing required minting parameters."));
  }
  try {
    // 1. Initialize Lucid
    const lucid = await Lucid.new(
      new Blockfrost(
        process.env.BLOCKFROST_API_URL,
        process.env.BLOCKFROST_API_KEY
      ),
      "Mainnet" // or 'Testnet' as needed
    );

    // 2. Load signing key from constant
    const signingKey = fs.readFileSync(INSTITUTION_SIGNING_KEY_PATH, "utf8");
    lucid.selectWalletFromPrivateKey(signingKey);

    // 3. Load policy script
    const policy = loadPolicyScript(policyScriptPath);
    const policyId = lucid.utils.mintingPolicyToId(policy);
    const unit = toUnit(policyId, fromText(tokenName));

    // 4. Build metadata (CIP-25)
    const nftMetadata = {
      [policyId]: {
        [tokenName]: metadata,
      },
    };

    // 5. Build and sign transaction
    const tx = await lucid
      .newTx()
      .mintAssets({ [unit]: 1n }, Data.void())
      .attachMintingPolicy(policy)
      .payToAddress(recipientAddress, { [unit]: 1n })
      .attachMetadata(721, nftMetadata)
      .complete();
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();

    res.status(200).json({ message: "NFT minted!", txHash, policyId, unit });
  } catch (error) {
    logger.error("Error minting token with Lucid:", error);
    next(new ApiError(500, "Error minting token."));
  }
};
