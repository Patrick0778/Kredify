
import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Outlet, useLocation } from "react-router-dom"

export function Layout() {
  const location = useLocation();
  // Check if we're on an auth page
  const isAuthPage = ['/signup', '/login', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <ThemeProvider defaultTheme="light">
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className={`flex-1 ${isAuthPage ? 'flex items-center justify-center' : ''}`}>
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </ThemeProvider>
  )
}
