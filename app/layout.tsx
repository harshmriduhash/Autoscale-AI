import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Autoscale-AI - AI-Powered Deployment Platform | Deploy Faster, Scale Smarter',
  description: 'The next evolution of cloud deployment. Deploy applications with AI-powered optimizations, predictive scaling, and autonomous error fixing. Experience the future of serverless infrastructure.',
  keywords: 'deployment, cloud, AI, serverless, infrastructure, DevOps, CI/CD, automation',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

