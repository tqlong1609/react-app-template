'use client'

import { useEffect } from 'react'
import { useFormState } from 'react-dom'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { signUp } from '@/lib/actions/signUp.action'

const SignUpForm = () => {
  const [state, formAction] = useFormState(signUp, undefined)

  const router = useRouter()

  useEffect(() => {
    state?.success && router.push('/login')
  }, [state?.success, router])

  return (
    <form action={formAction}>
      <input type="text" placeholder="username" name="username" />
      <input type="email" placeholder="email" name="email" />
      <input type="password" placeholder="password" name="password" />
      <input type="password" placeholder="password again" name="passwordRepeat" />
      <button>Register</button>
      {state?.error}
      <Link href="/login">
        Have an account? <b>Login</b>
      </Link>
    </form>
  )
}

export default SignUpForm
