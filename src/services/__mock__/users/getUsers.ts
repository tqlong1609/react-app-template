import { axiosMockAdapterInstance } from '@/services/config/axios'
import { UserService } from '@/services/lib/userService'
import { GetUsersResponse } from '@/services/lib/userService/schema'

import usersData from './data/users.json'

axiosMockAdapterInstance.onGet(new UserService().getUsersUrl).reply((config) => {
  console.log('🚀 ~ axiosMockAdapterInstance.onGet ~ config:', config)
  return [
    200,
    {
      users: usersData,
    } as GetUsersResponse,
  ]
})
