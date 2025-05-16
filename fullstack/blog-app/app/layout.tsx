import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "./providers"
import Image from "next/image"
import Logo from '@/public/logo.png';
const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Post Management",
  description: "Create, edit, and delete posts with ease",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <Providers>
      <body className={inter.className}>
          <main className="min-h-screen">
            <div className="py-4 border-b mb-10">
              <div className="container mx-auto px-4">
                <Image src={Logo} alt="logo" width={200} height={45}/>
              </div>
            </div>
            {children}
          </main>
      </body>
      </Providers>
    </html>
  )
}
