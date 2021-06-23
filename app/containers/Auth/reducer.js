/* global localStorage */
import saga from './sagas'
import { injectReducer, injectSaga } from 'redux-injectors'
import { createSlice } from '@reduxjs/toolkit'
import { registerWithPassword, loginWithPassword, resendEmail, receiveEmails, tokenVerify, finishedOnboarding, getUser } from 'api/users'
import decodeJwt from 'jwt-decode'

const SESSION_KEY = 'app.session'

// Remove old implementation
const oldKeys = [
  'app.rememberedEmail',
  'app.rememberedPassword',
  'app.rememberMe',
  'app.rememberedProfile']

oldKeys.map(key => {
  localStorage.removeItem(key)
})

let rememberedProfile = {}

const rememberedSession = JSON.parse(localStorage.getItem(SESSION_KEY)) || null
let rememberedEnabled = rememberedSession != null

if (rememberedSession) {
  const allowedGraphs = getGraphs(rememberedSession.user.token)
  if (!allowedGraphs.includes('open')) {
    allowedGraphs.push('open')
  }
  const { id: userId, email, firstName, lastName, onboarded, verified } = rememberedSession.user
  rememberedProfile = { userId, email, firstName, lastName, onboarded, verified, allowedGraphs }
}

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    remembered: {
      enabled: rememberedEnabled,
      email: rememberedProfile.email,
    },

    authToken: rememberedSession,
    userId: rememberedProfile.userId,
    allowedGraphs: rememberedProfile.allowedGraphs,
    authenticating: false,
    authenticationErrorLogin: null,
    authenticationErrorRegister: null,

    emailConfirmed: null,
    onBoardingStarted: rememberedProfile.onboarded,
    isRegistered: null,
    newEmail: null,

    // We don't store the full profile here,
    // only the properties that are needed for the
    // initial render
    firstName: rememberedProfile.firstName,
    lastName: rememberedProfile.lastName,
  },
  reducers: {
    authenticationStarted (state) {
      state.authenticating = true
    },
    authenticationFailedLogin (state, action) {
      const { reason } = action.payload
      state.authenticationErrorLogin = reason
      state.authenticating = false
      state.restoringSession = false
    },
    authenticationFailedRegister (state, action) {
      const { reason } = action.payload
      state.authenticationErrorRegister = reason
      state.authenticating = false
      state.restoringSession = false
    },
    tokenUpdated (state, action) {
      const token = action.payload
      state.authToken = token
    },
    onBoardStarted (state, action) {
      state.onBoardingStarted = action.payload
    },
    authenticationSucceeded (state, action) {
      const {
        authToken,
        firstName,
        lastName,
        userId,
        emailConfirmed,
        onBoardingStarted,
        newEmail,
        allowedGraphs,
      } = action.payload

      state.authenticating = false
      state.restoringSession = false
      state.authToken = authToken
      state.userId = userId
      state.allowedGraphs = allowedGraphs

      state.firstName = firstName
      state.lastName = lastName
      state.emailConfirmed = emailConfirmed
      state.onBoardingStarted = onBoardingStarted
      state.newEmail = newEmail
    },
    userLoggedOut (state) {
      state.firstName = null
      state.lastName = null
      state.userId = null
      state.authToken = null
      state.restoringSession = false
      state.emailConfirmed = false
      state.onBoardingStarted = false
    },
    removeAuthErrorLogin (state) {
      state.authenticationErrorLogin = null
    },
    removeAuthErrorRegister (state) {
      state.authenticationErrorRegister = null
    },
    authenticationFinished (state) {
      state.authenticating = false
    },
  },
})

export default authSlice

export const {
  authenticationStarted,
  authenticationFailedRegister,
  authenticationFailedLogin,
  authenticationSucceeded,
  tokenUpdated,
  userLoggedOut,
  onBoardStarted,
  removeAuthErrorLogin,
  removeAuthErrorRegister,
  authenticationFinished,
} = authSlice.actions

function storeRememberMe (token) {
  const session = JSON.stringify(token)
  localStorage.setItem(SESSION_KEY, session)
}

export function logout () {
  return function (dispatch) {
    storeRememberMe(false)
    dispatch(userLoggedOut())
  }
}

export function register ({ email, password, passwordConfirmation, firstName, lastName, getEmails }) {
  return async function (dispatch) {
    if (password !== passwordConfirmation) {
      return dispatch(authenticationFailedRegister({
        reason: 'Password and password confirmation do not match',
      }))
    }
    dispatch(authenticationStarted())
    try {
      const token = await registerWithPassword({
        email,
        password,
        firstName,
        lastName,
      })

      // If the user has signed up to receive emails from The Brane
      if (getEmails) {
        const data = token.user.token
        await receiveEmails(data)
      }

      const loginToken = await loginWithPassword({
        email,
        password,
      })
      const allowedGraphs = getGraphs(loginToken.user.token)
      // // Temp for testing yago community graph
      // allowedGraphs.push('the-brane-community-graph')
      if (!allowedGraphs.includes('open')) {
        allowedGraphs.push('open')
      }

      dispatch(tokenUpdated(loginToken))
      dispatch(authenticationSucceeded({
        authToken: loginToken,
        firstName: loginToken.user.first_name,
        lastName: loginToken.user.last_name,
        email,
        userId: loginToken.user.id,
        emailConfirmed: loginToken.user.verified,
        onBoardingStarted: false,
        newEmail: email,
        allowedGraphs,
      }))
      storeRememberMe(token)
    } catch (e) {
      let reason
      switch (e?.response.status) {
        case 422:
          reason = 'User already exists with the email'
          break
        case 400:
          reason = 'An account already exist for this email.'
          break
        default:
          reason = e.message
      }
      dispatch(authenticationFailedRegister({
        reason,
      }))
    }
  }
}

function getGraphs (token) {
  try {
    const result = decodeJwt(token)['https://thebrane.com/claims'].graphs.map(graph => graph.name)
    result.push('yago-stars')
    result.push('the-brane-community-graph')
    return result
  } catch (e) {
    // non invited user
    const openGraph = [{ name: 'open' }].map(graph => graph.name)
    openGraph.push('yago-stars')
    openGraph.push('the-brane-community-graph')
    return openGraph
  }
}

export function login ({ email, password }) {
  return async function (dispatch) {
    dispatch(authenticationStarted())
    try {
      const token = await loginWithPassword({
        email,
        password,
      })
      // dispatch(tokenUpdated(token))
      const id = token.user.id.toString()
      const {
        first_name: firstName,
        last_name: lastName,
      } = token.user
      const confirmed = token.user.verified
      const hasOnboardingStarted = token.user.onboarded

      // temp solution until users api is changed
      const allowedGraphs = getGraphs(token.user.token)
      // // Temp for testing yago community graph
      // allowedGraphs.push('the-brane-community-graph')
      if (!allowedGraphs.includes('open')) {
        allowedGraphs.push('open')
      }
      dispatch(authenticationSucceeded({
        authToken: token,
        firstName,
        lastName,
        email,
        userId: id,
        emailConfirmed: confirmed,
        onBoardingStarted: hasOnboardingStarted,
        newEmail: email,
        allowedGraphs,
      }))
      storeRememberMe(token)
    } catch (e) {
      let reason
      switch (e?.response.status) {
        case 404:
          reason = 'User doesn\'t exist'
          break
        case 401:
          reason = 'Email or password is invalid'
          break
        default:
          reason = e.message
      }
      dispatch(authenticationFailedLogin({
        reason: reason,
      }))
    }
  }
}

export function onBoardFinish (metaData) {
  return async function (dispatch) {
    const url = 'http://yago-knowledge.org/resource/'

    let locationData = metaData.Location.replace(/ /g, '_')
    const location = url.concat(locationData)

    const institutions = metaData.Institution.map((item) => {
      let data = item.replace(/ /g, '_')
      let result = url.concat(data)
      return result
    })

    const disciplines = metaData.Discipline.map((item) => {
      let data = item.replace(/ /g, '_')
      let result = url.concat(data)
      return result
    })

    const organisations = metaData.Organisations.map((item) => {
      let data = item.replace(/ /g, '_')
      let result = url.concat(data)
      return result
    })

    const occupations = metaData.Occupations.map((item) => {
      let data = item.replace(/ /g, '_')
      let result = url.concat(data)
      return result
    })

    const onBoardAnswers = {
      'metadata': {
        'Location': location,
        'Institutions': institutions,
        'Disciplines': disciplines,
        'Organisations': organisations,
        'Occupations': occupations,
        'Skills': metaData.Skills,
        'Projects': metaData.Projects,
        'Colleagues': metaData.Colleagues,
      },
      onboarded: true,
    }
    await finishedOnboarding(onBoardAnswers)
    const token = {
      user: await getUser(),
    }
    storeRememberMe(token)
    window.location.reload()
  }
}

export async function emailResend (email) {
  await resendEmail(email)
}

export function verifyToken (data) {
  return async function (dispatch) {
    dispatch(authenticationStarted())
    const token = await tokenVerify(data)
    dispatch(authenticationFinished())
    return token
  }
}

export function clearAuthErrorLogin () {
  return async function (dispatch) {
    dispatch(removeAuthErrorLogin())
  }
}

export function clearAuthErrorRegister () {
  return async function (dispatch) {
    dispatch(removeAuthErrorRegister())
  }
}

export const composeAuthReducer = [
  injectReducer({ key: 'auth', reducer: authSlice.reducer }),
  injectSaga({ key: 'auth', saga }),
]
