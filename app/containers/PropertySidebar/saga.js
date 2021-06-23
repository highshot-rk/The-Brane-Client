import { OPEN_SIDEBAR_MENU } from 'containers/HomePage/constants'
import { getRelatedProperties, getPropertyStatistics, getVennProperties } from 'api/node'
import { selectFocusedNode, selectSingleNodeView, selectFocusedRelatives } from 'containers/FixedPath/selectors'
import { call, put, select, takeEvery, all } from 'redux-saga/effects'
import { addTopicProperties, addStatistics, propertyLoading, propertyErrorMessage } from './actions'
import { ACTIVATE_PROPERTY } from './constants'
import { selectActiveProperties } from './selectors'
import { showSingleNodeView } from 'containers/FixedPath/actions'
import { VENN_ID } from '../../constants'
import { networkErrorPopup } from 'utils/network-error'

export function * loadProperties (action) {
  if (action.menu === 'properties') {
    const focusedNode = yield select(selectFocusedNode)
    const focusedRelatives = yield select(selectFocusedRelatives)

    let relatedIds = Object.keys(focusedRelatives)
    let result

    yield put(propertyErrorMessage(false))

    if (focusedNode._id === VENN_ID) {
      try {
        result = yield call(getVennProperties, relatedIds)
      } catch (e) {
        return yield networkErrorPopup(e)
      }
    } else {
      try {
        yield put(propertyLoading(true))
        result = yield call(getRelatedProperties, focusedNode._id)
      } catch (e) {
        yield put(propertyErrorMessage(true))
        return yield networkErrorPopup(e)
      }
    }
    yield put(propertyLoading(false))
    yield put(addTopicProperties(result))
    try {
      let statistics = yield call(
        getPropertyStatistics,
        focusedNode._id,
        focusedNode._id === VENN_ID ? relatedIds : null
      )

      yield put(addStatistics({
        topicId: focusedNode._id,
        statistics,
      }))
    } catch (e) {
      return yield networkErrorPopup(e)
    }
  }
}

export function * maybeShowSingleNodeView (action) {
  const active = yield select(selectActiveProperties())
  const focusedNode = yield select(selectFocusedNode)
  const singleNodeView = yield select(selectSingleNodeView)

  // Show single node view when 4th property is activated
  if (active.length === 4 && !singleNodeView.show) {
    yield put(showSingleNodeView(focusedNode._id, []))
  }
}

export default function * rootSaga () {
  yield all([
    takeEvery(OPEN_SIDEBAR_MENU, loadProperties),
    takeEvery(ACTIVATE_PROPERTY, maybeShowSingleNodeView),
  ])
}
