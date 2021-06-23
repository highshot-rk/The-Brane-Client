import { userApi } from '.'

export async function registerWithPassword ({
  email,
  password,
  firstName,
  lastName,
}) {
  const { data } = await userApi.post(`signup`, {
    email: email,
    username: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
  })
  return data
}

export async function loginWithPassword ({
  email,
  password,
}) {
  const { data } = await userApi.post('login', {
    email: email,
    password: password,
  }, {
    userRequired: false,
  })

  return data
}

export async function getUser () {
  const { data } = await userApi.get(`users/me`)
  return data.user
}

export async function deleteUser () {
  const { data } = await userApi.delete(`/users/me`)
  return data
}

export async function updateUser (properties) {
  const fieldsToUpdate = {
    first_name: properties.firstName,
    last_name: properties.lastName,
    email: properties.email,
  }
  const { data } = await userApi.patch(`/users`, fieldsToUpdate)
  return data
}

export async function verifyUser (email) {
  const cleanedEmail = encodeURIComponent(email)
  const { data } = await userApi.get(`/users/emailVerified/${cleanedEmail}`)
  return data
}

export async function resendEmail (email) {
  const cleanedEmail = encodeURIComponent(email)
  const { data } = await userApi.get(`/users/reverify/${cleanedEmail}`)
  return data
}

export async function receiveEmails () {
  const { data } = await userApi.post(`/users`, { email_updates: true })
  return data.user.email_updates
}

export async function tokenVerify (token) {
  try {
    const { data } = await userApi.get(`/users/verify/${token}`)
    return {
      data: data,
      verify: true,
    }
  } catch (e) {
    let reason
    switch (e?.response.status) {
      case 400:
        reason = 'Something went wrong'
        break
      case 401:
        reason = 'That is not allowed at this time'
        break
      default:
        reason = e.message
    }
    return {
      verify: false,
      data: reason,
    }
  }
}

export async function finishedOnboarding (metaData) {
  const { data } = await userApi.post(`/users`, metaData)
  return data.user.onboarded
}
