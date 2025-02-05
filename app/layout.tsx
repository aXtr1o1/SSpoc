import { DM_Sans, Bodoni_Moda } from 'next/font/google';
import "./globals.css";
import { cn } from "@/lib/utils";
import ErrorBoundary from '@/components/ErrorBoundary';
import Navbar from "@/components/Navbar";

const dmSans = DM_Sans({ subsets: ["latin"] });
const bodoni = Bodoni_Moda({ subsets: ['latin'] });

export const metadata = {
  title: "AI Startup Investor App",
  description: "Filter startup ideas and investors based on specific requirements",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(dmSans.className, "bg-[#2A2A2A]")}>
        <ErrorBoundary>
          <Navbar /> {/* Use the Navbar component here */}
          <main className="container mx-auto pt-24 px-4 min-h-screen">{children}</main>
        </ErrorBoundary>
      </body>
    </html>
  );
}
