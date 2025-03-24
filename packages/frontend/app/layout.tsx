import React from 'react'
import { Providers } from './providers'

export const metadata = {
  title: 'MultiAPI AI Chatbot',
  description: 'AI-powered chatbot with multiple API integrations',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}