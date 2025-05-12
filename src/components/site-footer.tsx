
import { Link } from "react-router-dom";

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 ABC Championship. All rights reserved.
        </p>
        <nav className="flex items-center gap-4 text-sm">
          <Link to="/terms" className="text-muted-foreground hover:text-foreground">
            Terms
          </Link>
          <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
            Privacy
          </Link>
          <Link to="/contact" className="text-muted-foreground hover:text-foreground">
            Contact
          </Link>
          <a 
            href="https://cardano.org" 
            target="_blank" 
            rel="noreferrer" 
            className="text-muted-foreground hover:text-foreground"
          >
            Built on Cardano
          </a>
        </nav>
      </div>
    </footer>
  )
}
