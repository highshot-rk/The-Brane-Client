import { SET_POPUP_MESSAGE } from '../containers/App/constants'
import { put } from 'redux-saga/effects'
import Raven from 'raven-js'

export const networkErrorPopup = function * networkError (e) {
  console.error(e)
  Raven.captureException(e)

  return yield put({
    type: SET_POPUP_MESSAGE,
    payload: {
      message: e,
      show: true,
      bgColor: 'red',
      textColor: 'white',
    },
  })
}
