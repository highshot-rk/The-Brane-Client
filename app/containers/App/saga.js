
import { SET_POPUP_MESSAGE, CLEAN_POPUP_MESSAGE } from './constants'
import { put, takeEvery, delay, all } from 'redux-saga/effects'
function * onShowPopup () {
  yield delay(4000)
  yield put({ type: CLEAN_POPUP_MESSAGE })
}

export default function * rootSaga () {
  yield all([
    takeEvery(SET_POPUP_MESSAGE, onShowPopup),
  ])
}
