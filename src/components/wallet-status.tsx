
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet } from "lucide-react"

interface WalletStatusProps {
  walletName: string
}

export function WalletStatus({ walletName }: WalletStatusProps) {
  // In a real app, these would come from Mesh SDK
  const walletAddress = "addr1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  const truncatedAddress = `${walletAddress.slice(0, 8)}...${walletAddress.slice(-4)}`
  const balance = "123.456 ₳"
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-cardano-green" />
          <Wallet className="h-4 w-4" />
          <span className="hidden md:inline">{walletName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Wallet</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <div className="text-xs text-muted-foreground">Address</div>
          <div className="font-mono text-xs">{truncatedAddress}</div>
        </div>
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5">
          <div className="text-xs text-muted-foreground">Balance</div>
          <div className="font-mono">{balance}</div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Copy Address</DropdownMenuItem>
        <DropdownMenuItem>View on Explorer</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Disconnect</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
