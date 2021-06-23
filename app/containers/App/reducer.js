import { SET_POPUP_MESSAGE, CLEAN_POPUP_MESSAGE } from './constants'
import saga from './saga'
import { injectReducer, injectSaga } from 'redux-injectors'

const initialState = {
  sideBarExpanded: false,
  popupMessage: {
    bgColor: '#1fb9d9', textColor: '#fff', message: '', show: false,
  },
}

function appReducer (state = initialState, action) {
  switch (action.type) {
    case SET_POPUP_MESSAGE:
      const { bgColor = '#1fb9d9', textColor = '#fff', message } = action.payload
      return {
        ...state,
        popupMessage: {
          bgColor, textColor, message, show: true,
        },
      }
    case CLEAN_POPUP_MESSAGE:
      return {
        ...initialState,
      }
    default:
      return state
  }
}

export default appReducer

export const composeAppReducer = [
  injectReducer({ key: 'global', reducer: appReducer }),
  injectSaga({ key: 'global', saga }),
]
