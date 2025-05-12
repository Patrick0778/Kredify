
import { CreateCredentialSteps } from "@/components/create-credential-steps"

export default function Create() {
  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Credential</h1>
          <p className="text-muted-foreground">
            Mint your achievements as verifiable credentials on the Cardano blockchain
          </p>
        </div>
        
        <CreateCredentialSteps />
      </div>
    </div>
  )
}
