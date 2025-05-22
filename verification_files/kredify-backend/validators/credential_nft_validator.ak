// credential_nft_validator.ak
// Aiken validator for minting credential NFTs

// This contract enforces that only an authorized institution can mint a credential NFT.
// The NFT must reference the credential's IPFS hash in its metadata.

// Replace with your actual authorized institution's public key hash
const AUTHORIZED_INSTITUTION_PKH: ByteArray = 0xYOUR_INSTITUTION_PKH;

validator {
    fn main(ctx: ScriptContext) -> Bool {
        // Check that the transaction is signed by the authorized institution
        let signed_by_institution = ctx.tx.is_signed_by(AUTHORIZED_INSTITUTION_PKH);

        // Check that exactly one NFT is minted (policy id matches this script)
        let minted = ctx.tx.minted;
        let nft_count = minted.filter(fn (asset) => asset.policy_id == ctx.this_script_hash).length;
        let one_nft = nft_count == 1;

        // Optionally: Check that the NFT metadata contains an IPFS hash (CIP-25 compliant)
        // This can be enforced off-chain or with more advanced on-chain logic

        signed_by_institution && one_nft
    }
}
