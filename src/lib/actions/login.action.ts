import { z } from 'zod'

export const loginSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
})

export type LoginSchema = z.infer<typeof loginSchema>

type FormState = {
  message?: string
}

export const login = async (prevState: FormState, formData: FormData) => {
  console.log('🚀 ~ login ~ formData:', formData)

  const validatedFields = loginSchema.safeParse(Object.fromEntries(formData))
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { username, password } = validatedFields.data

  try {
    return {
      message: 'Form data processed',
    }
  } catch (err) {
    return { error: 'Invalid username or password' }
  }
}
