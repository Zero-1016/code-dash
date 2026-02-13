import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import { JetBrains_Mono } from 'next/font/google'
import { getSiteUrl } from '@/lib/site-url'

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

export const metadata: Metadata = {
  metadataBase: getSiteUrl(),
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
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'CodeDash',
    url: getSiteUrl().toString(),
    inLanguage: ['en', 'ko'],
  }

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body
        className={`${pretendard.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <a
          href="#main-content"
          className="sr-only absolute left-3 top-3 z-[120] rounded-md bg-background px-3 py-2 text-sm font-medium text-foreground shadow focus:not-sr-only focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Skip to content
        </a>
        {children}
      </body>
    </html>
  )
}
