import { z } from 'zod'

const getUsersResponseSchema = z.object({
  users: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
    }),
  ),
})

type GetUserParams = void
type GetUsersResponse = z.infer<typeof getUsersResponseSchema>

export { getUsersResponseSchema }
export type { GetUserParams, GetUsersResponse }
