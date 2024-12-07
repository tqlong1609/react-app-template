import { MainLayout } from '@/layouts/mainLayout'
import { useAuthContext } from '@/providers/auth'
import { useRouter } from 'next/router'

function HomePage() {
  const { signOut } = useAuthContext()
  const router = useRouter()
  return (
    <div>
      <button
        onClick={async () => {
          await signOut()
          router.push('/guest/signin')
        }}
      >
        Login
      </button>
    </div>
  )
}

HomePage.getLayout = function getLayout(page: React.ReactNode): JSX.Element {
  return <MainLayout>{page}</MainLayout>
}

export default HomePage
