import z from 'zod'

const authenticationResponseSchema = z.object({})

const checkLoginResponseSchema = z.object({
  userId: z.string(),
})

const logoutResponseSchema = z.object({})

export type AuthenticationResponseSchema = z.infer<typeof authenticationResponseSchema>
export type CheckLoginResponseSchema = z.infer<typeof checkLoginResponseSchema>
export type LogoutResponseSchema = z.infer<typeof logoutResponseSchema>

export { authenticationResponseSchema, checkLoginResponseSchema, logoutResponseSchema }
