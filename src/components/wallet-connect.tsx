
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Card } from "@/components/ui/card"
import { WalletStatus } from "@/components/wallet-status"
import { cn } from "@/lib/utils"

type Wallet = {
  id: string
  name: string
  icon: string
  installed: boolean
}

export function WalletConnect() {
  const [isConnecting, setIsConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null)

  // Mock wallet data - in a real app this would come from Mesh SDK
  const wallets: Wallet[] = [
    {
      id: "nami",
      name: "Nami",
      icon: "N",
      installed: true,
    },
    {
      id: "eternl",
      name: "Eternl",
      icon: "E",
      installed: true,
    },
    {
      id: "flint",
      name: "Flint",
      icon: "F",
      installed: false,
    },
  ]

  const connectWallet = (walletId: string) => {
    setIsConnecting(true)
    setSelectedWallet(walletId)
    
    // Mock wallet connection - would use Mesh SDK in real implementation
    setTimeout(() => {
      setConnected(true)
      setIsConnecting(false)
    }, 1500)
  }

  return (
    <div className="flex items-center gap-2">
      {connected ? (
        <WalletStatus 
          walletName={wallets.find(w => w.id === selectedWallet)?.name || ""} 
        />
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Connect Wallet</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Connect wallet</DialogTitle>
              <DialogDescription>
                Select a wallet to connect to ABC Championship Credentials Platform.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              {wallets.map((wallet) => (
                <Card
                  key={wallet.id}
                  className={cn(
                    "p-4 cursor-pointer flex items-center justify-between hover:bg-muted transition-colors",
                    !wallet.installed && "opacity-50"
                  )}
                  onClick={() => wallet.installed && connectWallet(wallet.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary text-primary-foreground w-8 h-8 rounded-full flex items-center justify-center">
                      {wallet.icon}
                    </div>
                    <span className="font-medium">{wallet.name}</span>
                  </div>
                  {!wallet.installed && (
                    <span className="text-sm text-muted-foreground">Not installed</span>
                  )}
                  {isConnecting && selectedWallet === wallet.id && (
                    <div className="animate-pulse-slow">Connecting...</div>
                  )}
                </Card>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
