
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function Explore() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Explore Credentials</h1>
          <p className="text-muted-foreground">
            Discover and verify credentials on the Cardano blockchain
          </p>
        </div>
        <div className="relative w-full md:w-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search credentials..." 
            className="pl-10 w-full md:w-[300px]" 
          />
        </div>
      </div>
      
      <div className="bg-card rounded-lg p-12 text-center">
        <div className="mx-auto max-w-md">
          <h2 className="text-xl font-semibold mb-4">Verify a Credential</h2>
          <p className="text-muted-foreground mb-6">
            Enter a credential ID, policy ID, or scan a QR code to verify a credential on the blockchain
          </p>
          <div className="flex flex-col gap-4">
            <Input placeholder="Enter credential ID or policy ID" />
            <Button>Verify Credential</Button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">or</span>
              </div>
            </div>
            <Button variant="outline">Scan QR Code</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
