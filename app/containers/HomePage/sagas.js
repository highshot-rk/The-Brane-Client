import { ADD_NODE, SHOW_SINGLE_NODE_VIEW } from 'containers/FixedPath/constants'
import {
  CLOSE_PROFILE_MENU,
  HIDE_WELCOME,
  OPEN_SIDEBAR_MENU,
  OPEN_BOTTOMBAR_MENU,
  SHOW_NODE_CREATION_WINDOW,
  SHOW_NODE_EDIT_WINDOW,
} from './constants'
import { put, select, take, takeLatest, fork, all } from 'redux-saga/effects'
import { SHOW_MENU } from '../FixedPath/constants'

function * onShowNodeMenu ({ payload }) {
  const profileMenuOpen = yield select((state) => {
    return state.home.showProfileMenu
  })
  if (profileMenuOpen) {
    yield put({ type: CLOSE_PROFILE_MENU })
  }
}

const initialInteractions = [
  OPEN_SIDEBAR_MENU,
  OPEN_BOTTOMBAR_MENU,
  SHOW_NODE_CREATION_WINDOW,
  SHOW_NODE_EDIT_WINDOW,
  ADD_NODE,
  SHOW_SINGLE_NODE_VIEW,
]

function * watchInitialInteractions () {
  let welcomeHidden = false

  while (!welcomeHidden) {
    const action = yield take('*')

    if (!initialInteractions.includes(action.type)) {
      continue
    }
    yield put({ type: HIDE_WELCOME })
    welcomeHidden = true
  }
}

export default function * rootSaga () {
  yield all([
    takeLatest(SHOW_MENU, onShowNodeMenu),
    fork(watchInitialInteractions),
  ])
}
