// import '@/assets/style.scss'
import BootstrapClient from '@/components/BootstrapClient'
// import './globals.css';
import ReactQueryProvider from '@/providers/ReactQueryProvider'
import { Amplify } from 'aws-amplify'
import 'bootstrap/dist/css/bootstrap.min.css'
import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'

import '../scss/style.scss'
import '/public/dist-adminlte/css/adminlte.min.css'
import '/public/plugins/fontawesome-free/css/all.min.css'

/*
      - MBD_NODE_ENV=development
      - API_URL=https://development.hbs.symbol-develop.xyz
      - COGNITO_USER_POOL_ID=ap-northeast-1_KXEQDxgjd
      - COGNITO_USER_POOL_WEB_CLIENT_ID=2gmu1i5mvhujopsc0k420ba8h5
      - COGNITO_REDIRECT_SIGNIN=http://localhost:3000/member/dashboard/
      - COGNITO_REDIRECT_SIGNOUT=http://localhost:3000/member/dashboard/
*/
const runtimeConfig = {
  MBD_NODE_ENV: 'development',
  API_URL: 'https://development.hbs.symbol-develop.xyz',
  COGNITO_USER_POOL_ID: 'ap-northeast-1_KXEQDxgjd',
  COGNITO_USER_POOL_WEB_CLIENT_ID: '2gmu1i5mvhujopsc0k420ba8h5',
  COGNITO_REDIRECT_SIGNIN: 'http://localhost:3001/member/dashboard/',
  COGNITO_REDIRECT_SIGNOUT: 'http://localhost:3001/member/dashboard/'
}

const config = {
  Auth: {
    // identityPoolId: 'ap-northeast-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', //REQUIRED - Amazon Cognito Identity Pool ID
    region: 'ap-northeast-1', // REQUIRED - Amazon Cognito Region
    userPoolId: runtimeConfig.COGNITO_USER_POOL_ID, // OPTIONAL - Amazon Cognito User Pool ID
    userPoolWebClientId: runtimeConfig.COGNITO_USER_POOL_WEB_CLIENT_ID, // OPTIONAL - Amazon Cognito Web Client ID
    oauth: {
      scope: ['email', 'openid', 'aws.cognito.signin.user.admin'],
      redirectSignIn: runtimeConfig.COGNITO_REDIRECT_SIGNIN, // Cognito に同じ設定が必要
      redirectSignOut: runtimeConfig.COGNITO_REDIRECT_SIGNOUT, // Cognito に同じ設定が必要
      responseType: 'code'
    }
  }
}
Amplify.configure({
  auth: {
    aws_region: 'ap-northeast-1',
    user_pool_id: runtimeConfig.COGNITO_USER_POOL_ID,
    user_pool_client_id: runtimeConfig.COGNITO_USER_POOL_WEB_CLIENT_ID,
    oauth: {
      scopes: ['email', 'openid', 'aws.cognito.signin.user.admin'],
      redirect_sign_in_uri: [runtimeConfig.COGNITO_REDIRECT_SIGNIN],
      redirect_sign_out_uri: [runtimeConfig.COGNITO_REDIRECT_SIGNOUT],
      response_type: 'code',
      identity_providers: [],
      domain: 'localhost'
    }
  }
})

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
      <body className={notoSansJP.className}>
        <ReactQueryProvider>
          <div>{children}</div>
        </ReactQueryProvider>
        <BootstrapClient />
      </body>
    </html>
  )
}
