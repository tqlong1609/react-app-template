// import '@/assets/style.scss'
import '@/assets/style.scss'
import BootstrapClient from '@/components/BootstrapClient'
import Providers from '@/providers'
import 'admin-lte/plugins/fontawesome-free/css/all.min.css'
// import './globals.css';
// import 'bootstrap/dist/css/bootstrap.min.css'
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'

// import '/public/dist-adminlte/css/adminlte.min.css'
// import '/public/plugins/fontawesome-free/css/all.min.css'

/*
      - MBD_NODE_ENV=development
      - API_URL=https://development.hbs.symbol-develop.xyz
      - COGNITO_USER_POOL_ID=ap-northeast-1_KXEQDxgjd
      - COGNITO_USER_POOL_WEB_CLIENT_ID=2gmu1i5mvhujopsc0k420ba8h5
      - COGNITO_REDIRECT_SIGNIN=http://localhost:3000/member/dashboard/
      - COGNITO_REDIRECT_SIGNOUT=http://localhost:3000/member/dashboard/
*/

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-jp'
})

export const metadata: Metadata = {
  title: 'My Body Dashboard',
  description: 'My Body Dashboard'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <head>
        <link
          rel='stylesheet'
          href='https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css'
        />
      </head>
      <body className={`${notoSansJP.className} sidebar-mini layout-fixed sidebar-collapse`}>
        <Providers>
          <div>{children}</div>
        </Providers>
        <BootstrapClient />
      </body>
    </html>
  )
}
