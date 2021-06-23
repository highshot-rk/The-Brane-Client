import { registerSelectors } from 'reselect-tools'
import {
  selectSidebarMenu,
} from 'containers/HomePage/selectors'
import {
  selectRelatives,
  selectFocusedNode,
  selectNodes,
} from 'containers/FixedPath/selectors'
import {
  createSelector,
} from 'utils/redux'

const selectFilterMenu = (state) => state.filterMenu
registerSelectors({
  'filterMenu': selectFilterMenu,
})

export const selectTagFilters = () => createSelector(
  'tagFilters',
  selectFilterMenu,
  (filterMenuState) => filterMenuState.tagFilters
)
export const selectFilterWithin = () => createSelector(
  'filterWithin',
  selectFilterMenu,
  (filterMenuState) => filterMenuState.filterWithin
)
export const selectShowOnOrbit = () => createSelector(
  'showOnOrbit',
  selectFilterMenu,
  (filterMenuState) => filterMenuState.showOnOrbit
)

export const selectCountNodes = createSelector(
  'countNodes',
  selectNodes,
  selectRelatives,
  selectFocusedNode,
  (nodes, relatives, focusedNode) => {
    return {
      nodes,
      relatives,
      focusedNode,
    }
  }
)

export const maybeSelectCountNodes = () => createSelector(
  'maybeCountNodes',
  state => state,
  selectTagFilters(),
  selectSidebarMenu(),
  (state, tagFilters, sidebarMenu) => {
    if (tagFilters.length === 0 && sidebarMenu !== 'filter') {
      return {}
    }

    return selectCountNodes(state)
  })
