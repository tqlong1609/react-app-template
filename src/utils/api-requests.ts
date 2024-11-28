import { UserService } from '@/services'

export type User = {
  id: number
  name: string
  email: string
}

export async function getUsers() {
  const users = await new UserService().getUsers()
  return users.users
}
