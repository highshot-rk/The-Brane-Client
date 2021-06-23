import { SET_POPUP_MESSAGE, CLEAN_POPUP_MESSAGE } from './constants'

export function setPopupMessage (payload) {
  return { type: SET_POPUP_MESSAGE, payload }
}
export function cleanPopupMessage () {
  return { type: CLEAN_POPUP_MESSAGE }
}
