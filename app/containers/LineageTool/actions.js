import { CONFIRM_RESTORE_PATH, CANCEL_RESTORE_PATH, FOCUS_PATH_WINDOW } from './constants'

export function confirmRestorePath (pathIndex, nodeId) {
  return {
    type: CONFIRM_RESTORE_PATH,
    payload: {
      pathIndex,
      nodeId,
    },
  }
}

export function cancelRestorePath () {
  return {
    type: CANCEL_RESTORE_PATH,
  }
}

export function focusPathWindow (value) {
  return {
    type: FOCUS_PATH_WINDOW,
    payload: value,
  }
}
