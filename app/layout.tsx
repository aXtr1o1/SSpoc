import { DM_Sans, Bodoni_Moda } from 'next/font/google'
import "./globals.css"
import Link from "next/link"
import { cn } from "@/lib/utils"
import ErrorBoundary from '@/components/ErrorBoundary'

const dmSans = DM_Sans({ subsets: ["latin"] })
const bodoni = Bodoni_Moda({ subsets: ['latin'] })

export const metadata = {
  title: "AI Startup Investor App",
  description: "Filter startup ideas and investors based on specific requirements",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(dmSans.className, "bg-[#2A2A2A]")}>
        <ErrorBoundary>
          <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 rounded-full bg-black/20 backdrop-blur-xl border border-white/10">
            <div className="px-8 py-4">
              <div className="flex items-center justify-center space-x-12">
                <Link href="/" className="text-white/90 hover:text-white transition-colors text-lg font-medium">
                  StartUps
                </Link>
                <Link href="/investors" className="text-white/70 hover:text-white/90 transition-colors text-lg">
                  Investors
                </Link>
                <Link href="/contact" className="text-white/70 hover:text-white/90 transition-colors text-lg">
                  Contact
                </Link>
              </div>
            </div>
          </nav>
          <main className="container mx-auto pt-24 px-4 min-h-screen">{children}</main>
        </ErrorBoundary>
      </body>
    </html>
  )
}