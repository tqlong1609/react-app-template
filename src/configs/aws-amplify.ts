import { Amplify, Auth } from 'aws-amplify'

// TODO: move to env / docker compose
const runtimeConfig = {
  MBD_NODE_ENV: 'development',
  API_URL: 'https://development.hbs.symbol-develop.xyz',
  COGNITO_USER_POOL_ID: 'ap-northeast-1_KXEQDxgjd',
  COGNITO_USER_POOL_WEB_CLIENT_ID: '2gmu1i5mvhujopsc0k420ba8h5',
  COGNITO_REDIRECT_SIGNIN: 'http://localhost:3000/member/dashboard/',
  COGNITO_REDIRECT_SIGNOUT: 'http://localhost:3000/member/dashboard/'
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
