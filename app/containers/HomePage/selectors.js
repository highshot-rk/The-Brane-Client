import { createSelector } from 'reselect'

const selectHome = () => (state) => state.home

const selectSidebarMenu = () => createSelector(
  selectHome(),
  (homeState) => homeState.sideBarMenu
)

const selectBottombarMenu = () => createSelector(
  selectHome(),
  (homeState) => homeState.bottomBarMenu
)

const selectNodeCreationWindow = () => createSelector(
  selectHome(),
  (homeState) => homeState.nodeCreationWindow
)
const selectLinkCreationWindow = () => createSelector(
  selectHome(),
  homeState => homeState.linkCreationWindow
)
const selectPreviewWindowHistory = () => createSelector(
  selectHome(),
  (homeState) => homeState.previewWindowHistory
)

const selectPreviewWindowHistoryIndex = () => createSelector(
  selectHome(),
  (homeState) => homeState.previewWindowHistoryIndex
)
const selectShowProfileMenu = () => createSelector(
  selectHome(),
  (homeState) => homeState.showProfileMenu
)

const selectNodeEditWindow = () => createSelector(
  selectHome(),
  (homeState) => homeState.nodeEditWindow
)

const selectLinkEditWindow = () => createSelector(
  selectHome(),
  (homeState) => homeState.linkEditWindow
)

const selectWelcome = () => createSelector(
  selectHome(),
  (homeState) => homeState.welcome
)
const selectShowClearPathDialog = () => createSelector(
  selectHome(),
  (homeState) => homeState.showClearPathDialog
)
export {
  selectHome,
  selectSidebarMenu,
  selectNodeCreationWindow,
  selectLinkCreationWindow,
  selectPreviewWindowHistory,
  selectPreviewWindowHistoryIndex,
  selectNodeEditWindow,
  selectShowProfileMenu,
  selectLinkEditWindow,
  selectShowClearPathDialog,
  selectWelcome,
  selectBottombarMenu,
}
