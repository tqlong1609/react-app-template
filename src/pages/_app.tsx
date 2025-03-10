import '@/assets/style.scss'
import BootstrapClient from '@/components/BootstrapClient'
import Loader from '@/components/Loader'
import useRouteLoader from '@/hooks/useRouteLoader'
import Providers from '@/providers'
import { AuthConsumer } from '@/providers/auth'
import 'admin-lte/plugins/fontawesome-free/css/all.min.css'
import Head from 'next/head'

const SplashScreen = () => (
  <div className='h-screen flex items-center justify-center'>Loading Splash Screen</div>
)

export default function MyApp({ Component, pageProps }: any) {
  const getLayout = Component.getLayout ?? ((page: any) => page)
  const isLoading = useRouteLoader()

  // redirect home page when user go to / path
  if (typeof window !== 'undefined') {
    if (window.location.pathname === '/') {
      window.location.pathname = '/member/dashboard'
    }
  }

  return (
    <>
      <Head>
        <title>My Body Dashboard</title>
        <meta name='description' content='My Body Dashboard' />
        <link
          rel='stylesheet'
          href='https://code.ionicframework.com/ionicons/2.0.1/css/ionicons.min.css'
        />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700&display=fallback'
        ></link>
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap'
        ></link>
      </Head>
      <div>
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
