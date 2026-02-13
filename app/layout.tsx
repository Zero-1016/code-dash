import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { JetBrains_Mono } from 'next/font/google'

import './globals.css'

const pretendard = localFont({
  src: [
    {
      path: '../public/fonts/Pretendard-Regular.subset.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-Medium.subset.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-Bold.subset.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

function getMetadataBase(): URL {
  const fallback = 'http://localhost:3000'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? fallback
  try {
    return new URL(siteUrl)
  } catch {
    return new URL(fallback)
  }
}

export const metadata: Metadata = {
  metadataBase: getMetadataBase(),
  title: {
    default: 'CodeDash | Practice Coding, Build Habits',
    template: '%s | CodeDash',
  },
  description:
    'A modern coding practice platform to sharpen your algorithm skills with daily challenges, streaks, and a beautiful editor experience.',
  applicationName: 'CodeDash',
  keywords: [
    'coding practice',
    'algorithm practice',
    'javascript coding challenges',
    'technical interview prep',
    'leetcode alternative',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    siteName: 'CodeDash',
    title: 'CodeDash | Practice Coding, Build Habits',
    description:
      'Sharpen your algorithm skills with daily coding challenges, streak tracking, and built-in code review support.',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 1200,
        height: 630,
        alt: 'CodeDash',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeDash | Practice Coding, Build Habits',
    description:
      'Sharpen your algorithm skills with daily coding challenges, streak tracking, and built-in code review support.',
    images: ['/placeholder-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/codedash-mark.svg',
    shortcut: '/codedash-mark.svg',
    apple: '/codedash-mark.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#3B82F6',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${pretendard.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
