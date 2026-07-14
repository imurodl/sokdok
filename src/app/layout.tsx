import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sokdok — read Korean faster",
  description: "A Korean reading gym: measure your speed, train it, watch it climb.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <header className="border-b border-border">
          <div className="mx-auto max-w-3xl px-4 py-3 flex items-center gap-6">
            <Link href="/" className="font-semibold text-lg tracking-tight">
              속독 <span className="text-text-dim text-sm">Sokdok</span>
            </Link>
            <nav className="flex gap-4 text-sm text-text-dim">
              <Link href="/" className="hover:text-text">Library</Link>
              <Link href="/drill" className="hover:text-text">Drill</Link>
            </nav>
          </div>
        </header>
        <main className="flex-1 mx-auto w-full max-w-3xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
