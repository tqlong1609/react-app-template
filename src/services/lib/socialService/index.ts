import { AxiosResponse, getAxiosNormalInstance, isAxiosError } from '../../config/axios'
import { facebookApiConfig, googleApiConfig } from '../../config/config'
import { API_URL } from '../../config/url'
import { Services } from '../../Services'
import { updateAccountResponseSchema } from './schema'
import {
  GetFBAccessTokenParams,
  GetFBAccessTokenResponse,
  GetUserInforResponse,
  GoogleGetUserInfoResponse,
  GoogleValidateTokenResponse,
  ValidateTokenResponse,
} from './type'

const unknownErrorMsg = 'Social service unknown error'
interface ISocialService {
  validateToken(token: string): Promise<ValidateTokenResponse>
  getAccountInfor(token: string): Promise<GetUserInforResponse>

  getFBAccessToken(params: GetFBAccessTokenParams): Promise<GetFBAccessTokenResponse>
  getFBUserInfor(token: string): Promise<object>
}
export * from './type'
export class SocialService extends Services implements ISocialService {
  url = API_URL + '/social'
  abortController?: AbortController

  // GOOGLE LOGIN
  validateToken = async (token: string): Promise<ValidateTokenResponse> => {
    this.abortController = new AbortController()
    try {
      const response: AxiosResponse<GoogleValidateTokenResponse> =
        await getAxiosNormalInstance().get(
          googleApiConfig.validateTokenUrl + `?access_token=${token}`,
          {
            signal: this.abortController.signal,
          },
        )
      if (response.status === 200) {
        // Token is valid
        return {
          email: response.data.email,
          email_verified: response.data.email_verified,
          expires_in: response.data.expires_in,
        }
      } else {
        throw new Error('Error validate token response.status not valid')
      }
    } catch (error) {
      if (!this.isCancel(error)) {
        // Handle other errors
        console.error('Error validateToken:', error)
        throw error
      }
      throw new Error(unknownErrorMsg)
    }
  }
  getAccountInfor = async (token: string): Promise<GetUserInforResponse> => {
    this.abortController = new AbortController()
    try {
      const response: AxiosResponse<GoogleGetUserInfoResponse> = await getAxiosNormalInstance().get(
        googleApiConfig.getUserInforUrl,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          signal: this.abortController.signal,
        },
      )
      if (response.status === 200) {
        const userProfile = response.data
        return {
          email: userProfile.emailAddresses[0].value,
          firstName: userProfile.names[0].familyName,
          lastName: userProfile.names[0].givenName,
        }
      } else {
        throw new Error('Error fetching user profile')
      }
    } catch (error) {
      if (!this.isCancel(error)) {
        // Handle other errors
        console.error('Error fetching user profile:', error)
        throw error
      }
      throw new Error(unknownErrorMsg)
    }
  }

  // FACEBOOK LOGIN
  getFBAccessToken = async (params: GetFBAccessTokenParams): Promise<GetFBAccessTokenResponse> => {
    this.abortController = new AbortController()
    try {
      const response: AxiosResponse<GetFBAccessTokenResponse> = await getAxiosNormalInstance().get(
        facebookApiConfig.getFBAccessTokenUrl +
          `?client_id=${params.clientId}` +
          `&client_secret=${params.clientSecret}` +
          `&redirect_uri=${params.redirectUri}` +
          `&code=${params.code}`,
        {
          signal: this.abortController.signal,
        },
      )
      if (response.status === 200) {
        return response.data
      } else {
        throw new Error('Error fetching access token')
      }
    } catch (error) {
      if (!this.isCancel(error)) {
        // Handle other errors
        console.error('Error fetching access token:', error)
        throw error
      }
      throw new Error(unknownErrorMsg)
    }
  }
  getFBUserInfor = async (token: string): Promise<GetUserInforResponse> => {
    this.abortController = new AbortController()
    try {
      const response: AxiosResponse<GetUserInforResponse> = await getAxiosNormalInstance().get(
        facebookApiConfig.getFBUserInforUrl + `&access_token=${token}`,
        {
          signal: this.abortController.signal,
        },
      )
      if (response.status === 200) {
        // Token is valid
        return response.data
      } else {
        throw new Error('Error get facebook user infor response.status')
      }
    } catch (error) {
      if (!this.isCancel(error)) {
        // Handle other errors
        console.error('Error get facebook user infor: ', error)
        throw error
      }
      throw new Error(unknownErrorMsg)
    }
  }
}
