'use client'

import React, { useState } from 'react'

import { useAuth } from '@/providers/AuthProvider'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import GuestHeader from '@/components/GuestHeader'

const schema = z.object({
  userId: z.string().min(1, { message: 'ユーザーIDを入力してください' }),
  password: z.string().min(1, { message: 'パスワードを入力してください' })
})

type FormData = z.infer<typeof schema>;

const LoginPage: React.FC = () => {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  // TODO: handle isLoading
  const { logUserIn, isLoading } = useAuth()

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userId: '',
      password: ''
    },
    mode: 'all'
  });

  const onSubmit = (data: FormData) => {
    logUserIn({ userId: data.userId, password: data.password })
  };

  return (
    <div>
      <GuestHeader />
      <div className='hold-transition login-page'>
        <div className='login-box'>
          <div className='login-logo'>ログイン</div>
          <div className='card'>
            <div className='card-body login-card-body'>
              <p className='login-box-msg'>ユーザーIDとパスワードを入力してください</p>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className='form-group'>
                  <label htmlFor='userId'>ユーザーID</label>
                  <input
                    {...register('userId')}
                    id='userId'
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    type='text'
                    className={`form-control ${errors.userId ? 'is-invalid' : ''}`}
                  />
                  <div className='invalid-feedback'>{errors.userId?.message}</div>
                </div>
                <div className='form-group'>
                  <label htmlFor='password'>パスワード</label>
                  <input
                    {...register('password')}
                    id='password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type='password'
                    className={`form-control ${errors.password ? 'is-invalid' : ''}`}
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

export default LoginPage
