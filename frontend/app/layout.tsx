import type { Metadata } from 'next'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'King Choreography | Elite Cheer Choreography',
  description: 'Elite choreography for competitive cheer programs. In-person camps, virtual reviews, and championship-level routine design by Brian King.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0A0A0A] min-h-screen">
        <Toaster
          position="top-right"
          toastOptions={{ style: { background: '#121212', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' } }}
        />
        {children}
      </body>
    </html>
  )
}
