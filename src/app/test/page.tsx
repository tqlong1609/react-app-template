'use client'

import React, { useState } from 'react'

import { signIn } from 'aws-amplify/auth'

const TestPage: React.FC = () => {
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<{ userId?: string; password?: string }>({})

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    console.log('userId', userId)
    console.log('password', password)
    signIn({ username: userId, password })
      .then((result) => {
        console.log('result', result)
      })
      .catch((error) => {
        console.error('Error signing in:', error)
      })
  }

  const userIdHandleChange = () => {
    // Handle userId change
  }

  const passwordHandleChange = () => {
    // Handle password change
  }

  return (
    <div className='hold-transition login-page'>
      <div className='login-box'>
        <div className='login-logo'>ログイン</div>
        <div className='card'>
          <div className='card-body login-card-body'>
            <p className='login-box-msg'>ユーザーIDとパスワードを入力してください</p>
            <form onSubmit={onSubmit}>
              <div className='form-group'>
                <label htmlFor='userId'>ユーザーID</label>
                <input
                  id='userId'
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  type='text'
                  className={`form-control ${errors.userId ? 'is-invalid' : ''}`}
                  onBlur={userIdHandleChange}
                />
                <div className='invalid-feedback'>{errors.userId}</div>
              </div>
              <div className='form-group'>
                <label htmlFor='password'>パスワード</label>
                <input
                  id='password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type='password'
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  onBlur={passwordHandleChange}
                />
                <div className='invalid-feedback'>{errors.password}</div>
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
  )
}

export default TestPage
