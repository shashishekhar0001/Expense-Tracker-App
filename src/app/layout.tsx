import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import { BackgroundCanvas } from "@/components/BackgroundCanvas";
import { Navigation } from "@/components/Navigation";

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your expenses and reach your savings goals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <body className={`${syne.variable} ${dmSans.variable} min-h-full flex flex-col font-sans relative pb-20 md:pb-0 md:pl-64`}>
        <BackgroundCanvas />
        <Navigation />
        <div className="relative z-10 flex flex-col min-h-full">
          {children}
          
          {/* Mobile Creator Footer */}
          <div className="md:hidden mt-auto py-6 text-center z-10">
            <p className="text-xs text-white/50">
              Made by <a href="https://github.com/shashishekhar0001" target="_blank" rel="noopener noreferrer" className="text-[var(--color-brand-cyan)] hover:text-white transition-colors duration-200 font-medium">Shashi Shekhar</a>
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
