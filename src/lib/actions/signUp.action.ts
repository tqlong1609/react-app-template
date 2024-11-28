export const signUp = async (prevState: any, formData: any) => {
  const { username, email, password, passwordRepeat } = Object.fromEntries(formData)

  if (password !== passwordRepeat) {
    return { error: 'Passwords do not match' }
  }

  try {
    return { success: true }
  } catch (err) {
    return { error: 'Invalid username or password' }
  }
}
