
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export function HeroSection() {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center md:py-24">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl mb-6 bg-gradient-to-r from-cardano-blue to-cardano-teal bg-clip-text text-transparent animate-fade-in">
          Cardano Credentials Platform
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Secure, verifiable blockchain credentials for educational achievements and certifications. Mint your credentials as NFTs on the Cardano blockchain.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link to="/signup">
              Get Started
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/learn">
              Learn More
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-cardano-blue mb-2">01</div>
          <h3 className="text-lg font-medium mb-2">Create Credentials</h3>
          <p className="text-sm text-muted-foreground">
            Upload documents, add metadata, and mint credentials as NFTs.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-cardano-blue mb-2">02</div>
          <h3 className="text-lg font-medium mb-2">Verify & Share</h3>
          <p className="text-sm text-muted-foreground">
            Instant verification through blockchain with easy sharing options.
          </p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="text-3xl font-bold text-cardano-blue mb-2">03</div>
          <h3 className="text-lg font-medium mb-2">Manage & Transfer</h3>
          <p className="text-sm text-muted-foreground">
            Full control of your credentials in a user-friendly dashboard.
          </p>
        </div>
      </div>
    </div>
  )
}
