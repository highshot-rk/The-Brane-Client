import { SHOW, HIDE } from './constants'

export function showPreview (startId, stopId, fromSideBar = false) {
  return {
    type: SHOW,
    payload: {
      startId,
      stopId,
      fromSideBar,
    },
  }
}

export function hidePreview () {
  return {
    type: HIDE,
  }
}
