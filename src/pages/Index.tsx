
import { HeroSection } from "@/components/hero-section"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

export default function Index() {
  return (
    <div className="flex-1">
      <HeroSection />
      
      <div className="py-16 bg-muted">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Secure, Verifiable Digital Credentials
              </h2>
              <p className="text-muted-foreground mb-6">
                ABC Championship's Cardano Credential Platform leverages blockchain technology to create
                tamper-proof, instantly verifiable digital credentials. Our system ensures the highest 
                level of trust and security for educational achievements and professional certifications.
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-cardano-teal"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Tamper-proof blockchain verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-cardano-teal"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Easy sharing and verification</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-cardano-teal"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Permanent, immutable records</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-cardano-teal"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>Built on energy-efficient Cardano blockchain</span>
                </li>
              </ul>
              <Button asChild>
                <Link to="/learn">Learn More</Link>
              </Button>
            </div>
            <div className="bg-card rounded-lg p-6 shadow-md">
              <div className="aspect-video bg-gradient-to-br from-cardano-blue to-cardano-teal rounded-md flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M9 3v18" />
                  <path d="M13 9h4" />
                  <path d="M13 15h4" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="py-16">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Trusted by Industry Leaders
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our credential platform is used by top educational institutions and organizations 
              worldwide to issue verifiable digital credentials.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-24 bg-muted rounded-md flex items-center justify-center">
                <div className="text-2xl font-bold text-muted-foreground">
                  Logo {i + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="py-16 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight mb-4">
              Ready to Get Started?
            </h2>
            <p className="mb-8">
              Join the future of digital credentials today. Create, manage, and verify blockchain-based 
              credentials with our easy-to-use platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild>
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
        </div>
      </div>
    </div>
  )
}
