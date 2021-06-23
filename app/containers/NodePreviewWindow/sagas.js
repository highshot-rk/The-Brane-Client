import { call, put, select, takeEvery, all } from 'redux-saga/effects'
import { SHOW, LOAD_FAILED, LOAD_SUCCESS, RELATIVES_LOADED } from './constants'
import { PUSH_PREVIEW_HISTORY } from '../HomePage/constants'
import { getNode, getNodeImage, getRelatives, getTags } from 'api/node'
import { loadImage } from './actions'
import { featureEnabled } from 'utils/features'
import { VENN_ID } from '../../constants'
import { networkErrorPopup } from 'utils/network-error'

function * createVennNodeInfo () {
  const node = yield select((state) =>
    state.fixedPath.getIn(['nodes', VENN_ID]).toJS()
  )

  return yield put({
    type: LOAD_SUCCESS,
    payload: {
      node: {
        _type: 'venn',
        title: node.title,
        isVennSearch: true,
        vennIds: node.vennIds,
      },
      uploads: [],
    },
  })
}

function * fetchImages (id) {
  if (featureEnabled('uploadImages')) {
    try {
      const {
        url,
      } = yield call(getNodeImage, id)
      yield put(loadImage({ url, description: '' }))
    } catch (e) {
      return yield networkErrorPopup(e)
    }
  }
}

function * fetchNode (id) {
  if (id === VENN_ID) {
    return yield createVennNodeInfo()
  }

  try {
    const [
      node,
      tagList,
    ] = yield all([call(getNode, id), call(getTags, id)])
    node.tagList = tagList
    yield put({ type: LOAD_SUCCESS, payload: { node } })
  } catch (e) {
    yield put({ type: LOAD_FAILED, payload: { error: e } })
    return yield networkErrorPopup(e)
  }
}

function * fetchLinks (id) {
  // TODO: handle venn-search node
  try {
    const links = yield call(getRelatives, id, 'all', { embedTags: false })
    yield put({
      type: RELATIVES_LOADED,
      payload: [
        ...links,
      ],
    })
  } catch (e) {
    return yield networkErrorPopup(e)
  }
}

function * fetchNodeInfo (action) {
  if (action.payload.id === VENN_ID) {
    return yield createVennNodeInfo(action)
  }

  yield all([
    fetchNode(action.payload.id),
    fetchImages(action.payload.id),
    fetchLinks(action.payload.id),
  ])
}

function * pushPreviewHistory ({ payload }) {
  if (!payload.node) {
    return
  }
  const { node } = payload
  let historyRecord = ''
  if (node.isVennSearch) {
    historyRecord = { id: VENN_ID, title: node.title }
  } else {
    historyRecord = { id: node._id, title: node.title }
  }

  return yield put({
    type: PUSH_PREVIEW_HISTORY,
    payload: historyRecord,
  })
}

export default function * rootSaga () {
  yield all([
    takeEvery(LOAD_SUCCESS, pushPreviewHistory),
    takeEvery(SHOW, fetchNodeInfo),
  ])
}
