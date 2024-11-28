export const parseCookie = (cookie: string): Record<string, string> => {
  return cookie.split('; ').reduce(
    (acc, part) => {
      const [key, value] = part.split('=')
      if (key && value) {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, string>,
  )
}

export const setCookie = (name: string, value: string, days: number) => {
  const date = new Date()
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000)
  const expires = `expires=${date.toUTCString()}`
  document.cookie = `${name}=${value};${expires};path=/`
}

export const getCookie = (name: string): string | undefined => {
  const nameEQ = `${name}=`
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return undefined
}

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`
}
