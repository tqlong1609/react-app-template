import { useEffect } from 'react'

import GuestHeader from '@/components/GuestHeader'
import { useRouter } from 'next/router'

// import * as Sentry from '@sentry/browser'
import styles from './styles.module.scss'

type CustomError = {
  statusCode?: string
  message?: string
}

export default function ErrorFallback({ error }) {
  const { statusCode, message } = error as CustomError
  const router = useRouter()

  // useEffect(() => {
  //   if (isNuxtError(error) && error.statusCode !== '404') {
  //     Sentry.captureException(new Error(error.message))
  //   }
  // }, [error])

  const handleReturn = () => {
    router.push('/')
  }

  return (
    <div className='wrapper'>
      <GuestHeader />
      <section className={`content ${styles.content}`}>
        <div className='error-page'>
          <h2 className='headline text-warning'>{statusCode}</h2>
          <div className='error-content'>
            {message ? (
              <h3>
                <i className='fas fa-exclamation-triangle text-warning' />
                {message}
                <br />
                下記ボタンよりお戻りください。
              </h3>
            ) : (
              <h3>
                <i className='fas fa-exclamation-triangle text-warning' />
                お手数おかけしますが
                <br />
                下記ボタンよりお戻りください。
              </h3>
            )}
            <div>
              <button className='btn btn-primary btn-block' type='button' onClick={handleReturn}>
                戻る
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
