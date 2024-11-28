import { API_URL } from '../../config/url'
import { Services } from '../../Services'
import {
  AuthenticationResponseSchema,
  authenticationResponseSchema,
  CheckLoginResponseSchema,
  checkLoginResponseSchema,
  logoutResponseSchema,
  LogoutResponseSchema,
} from './schema'
import { LoginParams } from './type'

interface IAuthService {
  get loginUrl(): string
  get checkLoginUrl(): string
  get logoutUrl(): string
  login(data: LoginParams): Promise<AuthenticationResponseSchema>
  checkLogin(): Promise<CheckLoginResponseSchema>
  logout(): Promise<LogoutResponseSchema>
}

export class AuthService extends Services implements IAuthService {
  url: string = API_URL ?? ''
  abortController?: AbortController

  loginUrl: string = this.url + '/login'
  checkLoginUrl: string = this.url + '/check'
  logoutUrl: string = this.url + '/logout'

  login = async (
    data: LoginParams,
  ): Promise<{ data: AuthenticationResponseSchema; cookie: string | undefined }> => {
    try {
      const response = await this.fetchApi<
        LoginParams,
        typeof authenticationResponseSchema,
        AuthenticationResponseSchema
      >({
        method: 'POST',
        url: this.loginUrl,
        schema: authenticationResponseSchema,
        data,
      })

      return response
    } catch (error) {
      throw this.onError(error)
    }
  }

  checkLogin = async (): Promise<CheckLoginResponseSchema> => {
    try {
      const response = await this.fetchApi<
        void,
        typeof checkLoginResponseSchema,
        CheckLoginResponseSchema
      >({
        method: 'GET',
        url: this.checkLoginUrl,
        schema: checkLoginResponseSchema,
      })

      return response.data
    } catch (error) {
      throw this.onError(error)
    }
  }

  logout = async (): Promise<LogoutResponseSchema> => {
    try {
      await this.fetchApi<void, typeof logoutResponseSchema, LogoutResponseSchema>({
        method: 'POST',
        url: this.logoutUrl,
        schema: logoutResponseSchema,
      })
      return {
        message: 'Logout successful',
      }
    } catch (error) {
      throw this.onError(error)
    }
  }
}
