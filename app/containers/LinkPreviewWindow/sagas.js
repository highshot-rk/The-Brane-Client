import { put, select, call, takeEvery, all } from 'redux-saga/effects'
import { SHOW, LOAD_SUCCESS } from './constants'
import { PUSH_PREVIEW_HISTORY } from '../HomePage/constants'
import { getLink } from 'api/link'
import { getNode } from 'api/node'
import { networkErrorPopup } from 'utils/network-error'

function * pushPreviewHistory ({ payload }) {
  const pathNodes = yield select(state => {
    return state.fixedPath.get('nodes').toJS()
  })

  if (pathNodes[payload.startId] && pathNodes[payload.stopId]) {
    yield put({
      type: PUSH_PREVIEW_HISTORY,
      payload,
    })
  }
}

function * fetchNodes ({ payload }) {
  const pathNodes = yield select(state => {
    return state.fixedPath.get('nodes').toJS()
  })
  if (pathNodes[payload.startId] && pathNodes[payload.stopId]) {
    return {
      startNode: pathNodes[payload.startId],
      stopNode: pathNodes[payload.stopId],
    }
  }
  try {
    const nodes = yield Promise.all([
      getNode(payload.startId),
      getNode(payload.stopId),
    ])

    return {
      startNode: nodes[0],
      stopNode: nodes[1],
    }
  } catch (e) {
    return yield networkErrorPopup(e)
  }
}

function * fetchLinkDetails ({ payload }) {
  try {
    const [
      {
        startNode,
        stopNode,
      },
      link,
    ] = yield all([
      fetchNodes({ payload }),
      call(getLink, payload.stopId, payload.startId),
    ])

    yield put({
      type: LOAD_SUCCESS,
      payload: {
        uploads: [],
        startNode,
        stopNode,
        linkDetails: link,
      },
    })
  } catch (e) {
    return yield networkErrorPopup(e)
  }
}

export default function * rootSaga () {
  yield all([
    takeEvery(SHOW, pushPreviewHistory),
    takeEvery(SHOW, fetchLinkDetails),
  ])
}
