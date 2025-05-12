
import { StatsCards } from "@/components/stats-cards"
import { CredentialGrid } from "@/components/credential-grid"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { Plus } from "lucide-react"

export default function Dashboard() {
  return (
    <div className="container py-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Credentials Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your blockchain-verified credentials
          </p>
        </div>
        <Button asChild>
          <Link to="/create">
            <Plus className="mr-2 h-4 w-4" /> Create Credential
          </Link>
        </Button>
      </div>
      
      <div className="mb-8">
        <StatsCards />
      </div>
      
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Credentials</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Filter
          </Button>
          <Button variant="outline" size="sm">
            Sort
          </Button>
        </div>
      </div>
      
      <CredentialGrid />
    </div>
  )
}
