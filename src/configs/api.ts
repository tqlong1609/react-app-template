const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const API_URL_ROUTES = {
  AUTH: `${BASE_URL}/api/auth`,
  LOGIN: `${BASE_URL}/api/auth/login`,
  LOGOUT: `${BASE_URL}/api/auth/logout`,
}
