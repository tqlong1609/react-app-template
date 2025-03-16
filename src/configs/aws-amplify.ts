import { Amplify, Auth } from 'aws-amplify'

const runtimeConfig = {
  MBD_NODE_ENV: process.env.NEXT_PUBLIC_MRB_NODE_ENV,
  API_URL: process.env.NEXT_PUBLIC_API_URL,
  COGNITO_USER_POOL_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  COGNITO_USER_POOL_WEB_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID,
  COGNITO_REDIRECT_SIGNIN: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNIN,
  COGNITO_REDIRECT_SIGNOUT: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_SIGNOUT
}

export const awsAmplifyConfig = () => {
  const config = {
    Auth: {
      // identityPoolId: 'ap-northeast-1:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', //REQUIRED - Amazon Cognito Identity Pool ID
      region: 'ap-northeast-1', // REQUIRED - Amazon Cognito Region
      userPoolId: runtimeConfig.COGNITO_USER_POOL_ID, // OPTIONAL - Amazon Cognito User Pool ID
      userPoolWebClientId: runtimeConfig.COGNITO_USER_POOL_WEB_CLIENT_ID, // OPTIONAL - Amazon Cognito Web Client ID
      oauth: {
        scope: ['email', 'openid', 'aws.cognito.signin.user.admin'],
        redirectSignIn: runtimeConfig.COGNITO_REDIRECT_SIGNIN, // Cognito に同じ設定が必要
        redirectSignOut: runtimeConfig.COGNITO_REDIRECT_SIGNOUT, // Cognito に同じ設定が必要
        responseType: 'code'
      }
    }
  }
  Amplify.configure(config)
}

export default Auth
