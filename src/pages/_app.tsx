import '@/assets/style.scss'
import BootstrapClient from '@/components/BootstrapClient'
import Loader from '@/components/Loader'
import useRouteLoader from '@/hooks/useRouteLoader'
import Providers from '@/providers'
import { AuthConsumer } from '@/providers/auth'
import 'admin-lte/plugins/fontawesome-free/css/all.min.css'
import { Noto_Sans_JP } from 'next/font/google'
import Head from 'next/head'

const SplashScreen = () => (
  <div className='h-screen flex items-center justify-center'>Loading Splash Screen</div>
)

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-noto-sans-jp'
})

export default function MyApp({ Component, pageProps }: any) {
  const getLayout = Component.getLayout ?? ((page: any) => page)
  const isLoading = useRouteLoader()
  return (
    <>
      <Head>
        <title>My Body Dashboard</title>
        <meta name='description' content='My Body Dashboard' />
        <link
          rel='stylesheet'
          href='https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css'
        />
        {/* <script src='https://code.jquery.com/jquery-3.6.0.min.js'></script>
        <script src='https://cdn.jsdelivr.net/npm/admin-lte@3.2/dist/js/adminlte.min.js'></script> */}
      </Head>
      <div className={notoSansJP.className}>
        <Providers>
          {isLoading && <Loader />}
          <AuthConsumer>
            {(auth) =>
              auth.isLoading ? <SplashScreen /> : getLayout(<Component {...pageProps} />)
            }
          </AuthConsumer>
        </Providers>
        <BootstrapClient />
      </div>
    </>
  )
}
