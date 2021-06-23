import { createSelector } from 'reselect'
const selectRouter = state => state.router

const selectPath = createSelector(
  selectRouter,
  (route) => route.location.pathname
)

const selectAppState = () => {
  return (state) => {
    return state.global
  }
}

const selectPopupMessage = () => createSelector(
  selectAppState(),
  (globalState) => globalState.popupMessage
)

export {
  selectRouter,
  selectPath,
  selectAppState,
  selectPopupMessage,
}
