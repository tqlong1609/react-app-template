import { API_URL } from '@/services/config/url'
import { Services } from '@/services/Services'
import { isAxiosError } from 'axios'
import { ZodError } from 'zod'

import { GetUserParams, GetUsersResponse, getUsersResponseSchema } from './schema'

interface IUserService {
  getUsers(): Promise<GetUsersResponse>
}

const unknownError = 'Unexpected error occurred'

export class UserService extends Services implements IUserService {
  url: string = API_URL
  abortController?: AbortController | undefined

  getUsersUrl = this.url + '/users'

  getUsers = async (): Promise<GetUsersResponse> => {
    try {
      const response = await this.fetchApi<
        GetUserParams,
        typeof getUsersResponseSchema,
        GetUsersResponse
      >({
        method: 'GET',
        url: this.getUsersUrl,
        schema: getUsersResponseSchema,
      })

      return response.data
    } catch (error) {
      if (this.isCancel(error)) {
        throw error
      } else if (error instanceof ZodError) {
        throw new Error(error.message)
      } else if (isAxiosError(error)) {
        throw new Error(error.response ? error.response.data.message : unknownError)
      }
      throw new Error(unknownError)
    }
  }
}
