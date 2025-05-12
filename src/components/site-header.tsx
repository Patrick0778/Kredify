
import { Link } from "react-router-dom"
import { WalletConnect } from "@/components/wallet-connect"
import { ThemeSwitch } from "@/components/theme-switch"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Menu } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

export function SiteHeader() {
  // Mock auth state - this would be replaced with actual auth logic
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z" />
              </svg>
            </div>
            <span className="font-bold hidden md:inline-block">ABC Championship</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/dashboard" className="font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link to="/create" className="font-medium transition-colors hover:text-primary">
            Create Credential
          </Link>
          <Link to="/explore" className="font-medium transition-colors hover:text-primary">
            Explore
          </Link>
          <Link to="/help" className="font-medium transition-colors hover:text-primary">
            Help
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          {isAuthenticated ? (
            <WalletConnect />
          ) : (
            <div className="hidden md:block">
              <Button size="sm" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          )}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/create">Create Credential</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/explore">Explore</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/help">Help</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {isAuthenticated ? (
                  <DropdownMenuItem asChild>
                    <Link to="#">Connect Wallet</Link>
                  </DropdownMenuItem>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/login">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/signup">Sign Up</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
