import { createSelector } from 'reselect'

/**
 * Direct selector to the lineageTool state domain
 */
const selectLineageToolDomain = () => (state) => state.lineageTool

/**
 * Other specific selectors
 */
const selectPaths = () => createSelector(
  selectLineageTool(),
  (lineageToolState) => lineageToolState.paths
)
const selectActivePathIndex = () => createSelector(
  selectLineageTool(),
  (lineageToolState) => lineageToolState.activePathIndex
)
const selectPathWindowFocused = () => createSelector(
  selectLineageTool(),
  (lineageToolState) => lineageToolState.pathWindowFocused
)
/**
 * Default selector used by LineageTool
 */

const selectLineageTool = () => createSelector(
  selectLineageToolDomain(),
  (substate) => substate.toJS()
)

export default selectLineageTool
export {
  selectLineageToolDomain,
  selectPaths,
  selectActivePathIndex,
  selectPathWindowFocused,
}
