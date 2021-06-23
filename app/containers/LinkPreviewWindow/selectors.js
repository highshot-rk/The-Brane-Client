import { createSelector } from 'reselect'

const selectLinkPreviewWindowRaw = () => state => state.linkPreviewWindow
const selectLinkPreviewWindow = () => createSelector(
  selectLinkPreviewWindowRaw(),
  linkPreviewWindow => linkPreviewWindow.toJS()
)

export {
  selectLinkPreviewWindow,
}
