import { AuthenticationResponse, LoginParams } from '@/services/lib/authService/type'

import { axiosMockAdapterInstance } from '../../config/axios'
import { IAccount } from '../../entities'
import { AuthService } from '../../lib'
import accountsData from './data/accounts.json'

const accounts: Array<IAccount> = accountsData
axiosMockAdapterInstance.onPost(new AuthService().loginUrl).reply((config) => {
  const data = JSON.parse(config.data) as LoginParams
  console.log('🚀 ~ axiosMockAdapterInstance.onPost ~ data123:', data)
  const isValidLogin = accounts.some(
    (account) => account.email === data.email && account.password === data.password,
  )
  if (isValidLogin) {
    return [
      200,
      {
        message: 'Login success',
        token: 'This is new login access token :>',
      } as AuthenticationResponse,
    ]
  } else {
    return [
      /**
       * 401 Unauthorized: Mã lỗi này thường được
       * sử dụng khi người dùng không có quyền truy cập
       * vào tài nguyên hoặc yêu cầu không được xác thực.
       * Trong trường hợp này, email hoặc password không đúng.
       */
      401,
      {
        message: 'Wrong email or password',
      } as AuthenticationResponse,
    ]
  }
})
