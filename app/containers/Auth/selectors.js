import { createSelector } from 'utils/redux'

export const selectAuth = (state) => state.auth

export const selectLoggedIn = createSelector(
  'loggedIn',
  selectAuth,
  auth => {
    return !!auth.authToken || auth.restoringSession
  }
)

export const selectAuthErrorLogin = createSelector(
  'authError',
  selectAuth,
  auth => auth.authenticationErrorLogin
)

export const selectAuthErrorRegister = createSelector(
  'authError',
  selectAuth,
  auth => auth.authenticationErrorRegister
)

export const selectUsername = createSelector('username', selectAuth, (auth) => auth.username)
export const selectFirstName = createSelector('firstname', selectAuth, (auth) => auth.firstname)
export const selectEmail = createSelector('email', selectAuth, (auth) => {
  if (auth.authToken) {
    return auth.authToken.user.email
  } else {
    return auth.remembered.email
  }
})
export const selectEmailConfirmed = createSelector(
  'emailConfirmed',
  selectAuth,
  (auth) => {
    if (auth.authToken) {
      return auth.authToken.user.verified
    }
    return auth.emailConfirmed
  })
export const selectOnboardingStarted = createSelector(
  'onBoardingStarted',
  selectAuth,
  (auth) => {
    try {
      return auth.authToken.user.onboarded
    } catch {
      return false
    }
  }
)
export const selectIsRegistered = createSelector(
  'isRegistered',
  selectAuth,
  (auth) => auth.isRegistered
)

export const selectNewEmail = createSelector(
  'newEmail',
  selectAuth,
  (auth) => auth.newEmail
)

export const selectAuthenticating = createSelector(
  'authenticating',
  selectAuth,
  (auth) => {
    return auth.authenticating
  }
)

export const selectAllowedGraphs = createSelector(
  'allowedGraphs',
  selectAuth,
  (auth) => {
    return auth.allowedGraphs
  }
)
