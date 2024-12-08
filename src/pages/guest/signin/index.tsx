import { Controller, useForm } from 'react-hook-form'

import { NextPageWithLayout } from '@/commons/types'
import GuestHeader from '@/components/GuestHeader'
import { ROUTE_PATHS } from '@/configs/router'
import { AuthLayout } from '@/layouts/auth'
import { useAuthContext } from '@/providers/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/router'
import * as z from 'zod'

const schema = z.object({
  userId: z.string().min(1, { message: 'ユーザーIDを入力してください' }),
  password: z.string().min(1, { message: 'パスワードを入力してください' })
})

type FormData = z.infer<typeof schema>

const LoginPage: NextPageWithLayout = () => {
  const { signIn } = useAuthContext()
  const router = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: '',
      password: ''
    },
    mode: 'all'
  })

  const onSubmit = async (data: FormData) => {
    try {
      await signIn({ username: data.userId, password: data.password })
      if (router?.query?.continueUrl) {
        router.push(router?.query?.continueUrl.toString())
      } else {
        router.push(ROUTE_PATHS.DASHBOARD)
      }
    } catch (err) {
      console.error(err)
      // TODO: show error
    }
  }

  return (
    <div>
      <GuestHeader />
      <div className='hold-transition login-page'>
        <div className='login-box'>
          <div className='login-logo'>ログイン</div>
          <div className='card'>
            <div className='card-body login-card-body'>
              <p className='login-box-msg'>ユーザーIDとパスワードを入力してください</p>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className='form-group'>
                  <label htmlFor='userId'>ユーザーID</label>
                  <Controller
                    name='userId'
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id='userId'
                        type='text'
                        className={`form-control ${errors.userId ? 'is-invalid' : ''}`}
                      />
                    )}
                  />
                  <div className='invalid-feedback'>{errors.userId?.message}</div>
                </div>
                <div className='form-group'>
                  <label htmlFor='password'>パスワード</label>
                  <Controller
                    name='password'
                    control={control}
                    render={({ field }) => (
                      <input
                        {...field}
                        id='password'
                        type='password'
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                      />
                    )}
                  />
                  <div className='invalid-feedback'>{errors.password?.message}</div>
                </div>
                <div className='row'>
                  <div className='col-12'>
                    <button type='submit' className='btn btn-primary btn-block'>
                      ログイン
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

LoginPage.getLayout = (page) => {
  return <AuthLayout>{page}</AuthLayout>
}

export default LoginPage
