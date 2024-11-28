import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'

import '/public/plugins/fontawesome-free/css/all.min.css'
import '/public/dist/css/adminlte.min.css'
import '../scss/style.scss'

import 'bootstrap/dist/css/bootstrap.min.css'

// import '@/assets/style.scss'
import BootstrapClient from '@/components/BootstrapClient'
// import './globals.css';
import ReactQueryProvider from '@/providers/ReactQueryProvider'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-jp',
})

export const metadata: Metadata = {
  title: 'My Body Dashboard',
  description: 'My Body Dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css" />
      </head>
      <body className={notoSansJP.className}>
        <ReactQueryProvider>
          <div>{children}</div>
        </ReactQueryProvider>
        <BootstrapClient />
      </body>
    </html>
  )
}
