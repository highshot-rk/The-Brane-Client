import { put, all, select } from 'redux-saga/effects'
import decodeJwt from 'jwt-decode'
import { login, logout } from '../reducer'
import { featureEnabled } from 'utils/features'

export const onRequestSuccess = response => {
  let token = response.headers['x-session-id']
  if (token && response.data.success) {
    const jwtInfo = decodeJwt(token)
    const session = {
      xSessionId: token,
      createdAt: jwtInfo.iat,
      expiresIn: jwtInfo.exp,
      user: { ...jwtInfo.payload, id: jwtInfo.uid },
    }
    return session
  } else {
    onRequestFailed({ status: 0, message: 'Failed to login check your entry data' })
  }
  return null
}

const onRequestFailed = exception => {
  throw exception
}

function * rememberMe () {
  if (!featureEnabled('accounts')) {
    return
  }

  try {
    const {
      remembered: {
        email,
        password,
      },
      restoringSession,
    } = yield select(state => state.auth)

    if (restoringSession) {
      // Following line can be uncommented for easy testing of
      // pausing requests until logged in
      // yield new Promise(resolve => setTimeout(resolve, 3000))

      yield put(login({ email, password, rememberMe: true }))
    }
  } catch (e) {
    yield put(logout())
  }
}

// TODO: these sagas are currently not used
export default function * rootSaga () {
  yield all([
    rememberMe(),
  ])
}
