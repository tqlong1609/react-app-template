'use client'

import { useFormState } from 'react-dom'

import Link from 'next/link'

import { login } from '@/lib/actions/login.action'

const LoginForm = () => {
  const [state, formAction] = useFormState(login, {
    message: '',
  })

  return (
    <form action={formAction}>
      <input type="text" placeholder="username" name="username" required />
      <input type="password" placeholder="password" name="password" required />
      <button>Login</button>
      {state?.error}
      <Link href="/signup">
        {"Don't have an account?"} <b>Register</b>
      </Link>
    </form>
  )
}

export default LoginForm
