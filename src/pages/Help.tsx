
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

export default function Help() {
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Help Center</h1>
          <p className="text-muted-foreground">
            Find answers to frequently asked questions about the ABC Championship Credentials Platform
          </p>
        </div>
        
        <div className="bg-card rounded-lg p-6">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>What are blockchain credentials?</AccordionTrigger>
              <AccordionContent>
                Blockchain credentials are digital certificates or documents stored on a blockchain, 
                making them tamper-proof and verifiable. On our platform, credentials are minted as 
                NFTs (Non-Fungible Tokens) on the Cardano blockchain, providing a permanent and 
                transparent record of educational achievements and certifications.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-2">
              <AccordionTrigger>How do I connect my Cardano wallet?</AccordionTrigger>
              <AccordionContent>
                Click on the "Connect Wallet" button in the top-right corner of the screen. 
                You'll be presented with options to connect popular Cardano wallets like Nami, 
                Eternl, or Flint. Make sure you have one of these wallets installed as a browser 
                extension before attempting to connect.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-3">
              <AccordionTrigger>What information is stored on the blockchain?</AccordionTrigger>
              <AccordionContent>
                The credential's metadata (such as title, issuer, date, etc.) and a hash of the 
                document are stored on the blockchain. The actual document is stored on IPFS 
                (InterPlanetary File System), a decentralized storage system. This ensures privacy 
                while still providing a verifiable link between the document and its blockchain record.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-4">
              <AccordionTrigger>How much does it cost to mint a credential?</AccordionTrigger>
              <AccordionContent>
                Minting a credential requires paying a transaction fee on the Cardano blockchain, 
                which typically ranges from 0.17 to 0.5 ADA depending on network conditions. 
                Additionally, there's a deposit of 2 ADA per credential, which is refundable if 
                you ever decide to delete the credential.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-5">
              <AccordionTrigger>How can someone verify my credential?</AccordionTrigger>
              <AccordionContent>
                You can share your credential through a public URL or QR code. Anyone with this link 
                can verify the authenticity of the credential by checking its record on the Cardano 
                blockchain through our platform's "Explore" section. They don't need a wallet or 
                account to verify credentials.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-6">
              <AccordionTrigger>Can I transfer my credential to someone else?</AccordionTrigger>
              <AccordionContent>
                Yes, since credentials are minted as NFTs, they can be transferred to other Cardano 
                addresses. However, this should be done carefully as it transfers ownership of the 
                credential. Typically, credentials should remain with the person who earned them.
              </AccordionContent>
            </AccordionItem>
            
            <AccordionItem value="item-7">
              <AccordionTrigger>What happens if I lose access to my wallet?</AccordionTrigger>
              <AccordionContent>
                If you lose access to your wallet, you'll also lose access to your credentials. It's 
                crucial to keep your wallet's recovery phrase safe. We recommend storing credentials 
                in a wallet specifically dedicated to long-term storage of important assets.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  )
}
