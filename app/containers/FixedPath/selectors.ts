import { createSelector } from 'reselect'
import Immutable from 'immutable'
import { Node, ExpandedMiniClusters, PathAnimation, SingleNodeViewConfig, BranchPipelineConfig, NodeMenuConfig, FocusedNode, Relative, RelativeMap, ReorderedRelative } from './types';

const selectFixedPath = (state: any) => state.fixedPath

const selectPropFactory = (property: string) =>
  createSelector(
    selectFixedPath,
    (fixedPathState: Immutable.Map<string, any>) => fixedPathState.get(property)
  )

const selectFocusedRelativesRaw = createSelector(
  selectPropFactory('relatives'),
  selectPropFactory('focusedNode'),
  (relatives: Immutable.Map<string, Relative>, focusedNode: string) => {
    if (!focusedNode) {
      return null
    }

    return relatives.get(focusedNode)
  }
)

const selectFocusedRelatives = createSelector(
  selectFocusedRelativesRaw,
  (relatives: any): RelativeMap => relatives.toJS()
)

const selectFocusedNodeId = createSelector(
  selectFixedPath,
  (fixedPath: any): string => fixedPath.get('focusedNode')
)

const selectFocusedNode = createSelector(
  selectFocusedNodeId,
  selectPropFactory('nodes'),
  selectFocusedRelatives,
  (focusedNode: string, nodes: Immutable.Map<string, Immutable.Map<string, any>>, relatives: RelativeMap) => {
    if (!focusedNode) {
      return null
    }

    let parent = (nodes.get(focusedNode).toJS() as FocusedNode)
    parent.relatives = Object.keys(relatives).map((key) => {
      return relatives[key]
    })
    return parent
  }
)

const selectMenu = createSelector(
  selectFixedPath,
  (fixedPathState: any): NodeMenuConfig => fixedPathState.get('menu')
)

const selectOpenMenuFor = createSelector(
  selectFixedPath,
  (fixedPathState: any): string => {
    return fixedPathState.get('openMenuFor')
  }
)

const selectProgress = createSelector(
  selectFixedPath,
  (fixedPathState) => {
    return fixedPathState.get('progress')
  }
)

const selectNodes = createSelector(
  selectPropFactory('nodes'),
  (nodes: any): {[index: string]: Node} => {
    return nodes.toJS()
  }
)

const selectReorderedRelatives = createSelector(
  selectPropFactory('reorderedRelatives'),
  (reorderedRelatives: any): {[index: string]: ReorderedRelative[]}  => reorderedRelatives.toJS()
)

const selectRelatives = createSelector(
  selectPropFactory('relatives'),
  (relatives: any): {[index: string]: RelativeMap} => {
    return relatives.toJS()
  }
)

const selectBranchPipeline = createSelector(
  selectPropFactory('branchPipeline'),
  (branchPipeline: any): BranchPipelineConfig  => {
    return branchPipeline.toJS()
  }
)

const selectSingleNodeView = createSelector(
  selectPropFactory('singleNodeView'),
  (singleNodeView: any): SingleNodeViewConfig => {
    return singleNodeView.toJS()
  }
)

const selectAnimationData = createSelector(
  selectFixedPath,
  (fixedPathState: any): PathAnimation => {
    return fixedPathState.get('animationData').toJS()
  }
)

const selectZoomValue = createSelector(
  selectFixedPath,
  (fixedPathState: any): number => fixedPathState.get('zoomValue')
)

const selectCenterOnFocused = createSelector(
  selectFixedPath,
  // 
  (fixedPathState: any) => fixedPathState.get('centerOnFocused')
)
const selectUnconfirmedSearch = createSelector(
  selectFixedPath,
  // TODO: add types for return value
  (fixedPathState: any): any  => {
    return fixedPathState.get('unconfirmedSearch')
  }
)
const selectOpenLPWfor = createSelector(
  selectFixedPath,
  // TODO: add types for return value
  (fixedPathState: any): any => fixedPathState.get('openLPWfor')
)

const selectActivePathId = createSelector(
  selectFixedPath,
  (fixedPathState: any): number => fixedPathState.get('activePath')
)

const selectFocusChild = createSelector(
  selectFixedPath,
  (fixedPathState: any): string => fixedPathState.get('focusChild')
)

const selectMiniClusters = createSelector(
  selectFixedPath,
  (fixedPathState: any): boolean => fixedPathState.get('miniClusters')
)

const selectExpandedMiniClusters = createSelector(
  selectPropFactory('expandedMiniClusters'),
  (expandedMiniClusters: any): ExpandedMiniClusters => expandedMiniClusters.toJS()
)

const selectHistory = createSelector(
  selectPropFactory('history'),
  (history: any): string[] => history.toJS()
)

const selectLoadingRelativesFor = () => createSelector(
  selectFixedPath,
  (state) => {
    const result = state.get('loadingRelativesFor')
    if (result) {
      return result
    } else {
      return false
    }
  }
)

const selectPreLoaded = () => createSelector(
  selectFixedPath,
  (state) => {
    const result = state.get('preLoaded')
    if (result) {
      return result
    } else {
      return false
    }
  }
)

const selectAllOrbitsLocked = selectPropFactory('allOrbitsLocked')

export {
  selectFixedPath,
  selectFocusedNode,
  selectFocusedRelatives,
  selectSingleNodeView,
  selectMenu,
  selectOpenMenuFor,
  selectNodes,
  selectRelatives,
  selectBranchPipeline,
  selectAnimationData,
  selectReorderedRelatives,
  selectZoomValue,
  selectCenterOnFocused,
  selectUnconfirmedSearch,
  selectOpenLPWfor,
  selectActivePathId,
  selectFocusChild,
  selectMiniClusters,
  selectExpandedMiniClusters,
  selectFocusedNodeId,
  selectHistory,
  selectAllOrbitsLocked,
  selectLoadingRelativesFor,
  selectPreLoaded,
  selectProgress,
}
