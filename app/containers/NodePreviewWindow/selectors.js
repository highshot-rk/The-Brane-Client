import { createSelector } from 'reselect'

const selectNodePreviewWindow = () => state => state.nodePreviewWindow

const selectShowNodePreviewWindow = () => createSelector(
  selectNodePreviewWindow(),
  (nodePreviewWindow) => nodePreviewWindow.show
)
export {
  selectNodePreviewWindow,
  selectShowNodePreviewWindow,
}
