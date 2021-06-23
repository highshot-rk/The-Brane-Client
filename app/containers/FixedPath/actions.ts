import {
  ADD_LINK,
  ADD_NODE,
  ADD_REORDERED_CHILD,
  ANIMATE_BRANCH_COLLAPSE,
  COLLAPSE_BRANCH,
  EXPAND_BRANCH,
  FOCUS_NODE,
  HIDE_BRANCH_PIPELINE,
  HIDE_MENU,
  OPEN_MENU_FOR,
  HIDE_SINGLE_NODE_VIEW,
  NEW_SEARCH_CONFIRMED,
  NEW_SEARCH_CANCELED,
  SHOW_BRANCH_PIPELINE,
  SHOW_MENU,
  SHOW_SINGLE_NODE_VIEW,
  START_SEARCH,
  TOGGLE_ORBIT_LOCK,
  SINGLE_NODE_VIEW_READY,
  TOGGLE_CLUSTER_STATE,
  ZOOM_IN,
  ZOOM_OUT,
  CENTER_ON_FOCUSED,
  OPEN_LINK_PREVIEW_WINDOW_FOR,
  UPDATE_NODES,
  RESTORE_PATH,
  RESTORE_SAVED_PATH,
  FOCUS_CHILD,
  TOGGLE_ALL_ORBITS,
  TOGGLE_MINI_CLUSTERS,
  SELECT_MINI_CLUSTER,
  EXPORT_TOPICS,
  HISTORY_PREV,
  HISTORY_NEXT,
  CHILDREN_LOADING,
  CHILDREN_PRE_LOADED,
} from './constants'
import { Node, Quadrant } from './types'

export function showMenu (node: string, x: number, y: number, isChild: boolean, parentId: string, angleOrRadius: Quadrant) {
  return {
    type: SHOW_MENU,
    payload: {
      node,
      x,
      y,
      isChild,
      parentId,
      angleOrRadius,
    },
  }
}

export function hideMenu () {
  return {
    type: HIDE_MENU,
  }
}

export function openMenuFor (childId: string) {
  return {
    type: OPEN_MENU_FOR,
    payload: {
      childId,
    },
  }
}

export function addNode ({ id, title, _type }: { id: string, title: string, _type: string}, sourceId: string, angle: Quadrant, isParent: boolean) {
  return {
    type: ADD_NODE,
    payload: {
      id,
      _type,
      title,
      sourceId,
      angle,
      isParent,
    },
  }
}

export function addLink (fromId: string, toId: string, nodeTitle: string) {
  return {
    type: ADD_LINK,
    payload: {
      from: fromId,
      to: toId,
      nodeTitle,
    },
  }
}

export function addReorderedRelative (parentId: string, childId: string, index: number, side: string) {
  return {
    type: ADD_REORDERED_CHILD,
    payload: {
      parentId,
      childId,
      index,
      side,
    },
  }
}

export function focusNode (id: string) {
  return {
    type: FOCUS_NODE,
    payload: {
      id,
    },
  }
}

export function collapseBranch (id: string, sourceNode: any) {
  return {
    type: COLLAPSE_BRANCH,
    payload: {
      id,
      sourceNode,
    },
  }
}

export function expandBranch (id: string, angle: number) {
  return {
    type: EXPAND_BRANCH,
    payload: {
      id,
      angle,
    },
  }
}

export function toggleOrbitLock (id: string) {
  return {
    type: TOGGLE_ORBIT_LOCK,
    payload: {
      id,
    },
  }
}

export function toggleAllOrbits () {
  return {
    type: TOGGLE_ALL_ORBITS,
  }
}

export function toggleMiniClusters () {
  return {
    type: TOGGLE_MINI_CLUSTERS,
  }
}

export function selectMiniCluster (nodeId: string, clusterId: string) {
  return {
    type: SELECT_MINI_CLUSTER,
    payload: {
      nodeId,
      clusterId,
    },
  }
}

export function showBranchPipeline (id: string) {
  return {
    type: SHOW_BRANCH_PIPELINE,
    payload: {
      id,
    },
  }
}

export function hideBranchPipeline (parentId: string, focusId: string, collapseNodes: any, expandNodes: any, animationData: any) {
  return {
    type: HIDE_BRANCH_PIPELINE,
    payload: {
      parentId,
      focusId,
      collapseNodes,
      expandNodes,
      animationData,
    },
  }
}

export function animateBranchCollapse (focusId: string, animationData: any) {
  return {
    type: ANIMATE_BRANCH_COLLAPSE,
    payload: {
      focusId,
      animationData,
    },
  }
}

export function startSearch (results: any) {
  return {
    type: START_SEARCH,
    payload: results,
  }
}

export function newSearchConfirm (result: any) {
  return {
    type: NEW_SEARCH_CONFIRMED,
    payload: result,
  }
}

export function newSearchCancel () {
  return {
    type: NEW_SEARCH_CANCELED,
  }
}

export function showSingleNodeView (_id: string, animationData: any) {
  return {
    type: SHOW_SINGLE_NODE_VIEW,
    payload: {
      _id,
      animationData,
    },
  }
}

export function singleNodeViewReady () {
  return {
    type: SINGLE_NODE_VIEW_READY,
  }
}

export function hideSingleNodeView () {
  return {
    type: HIDE_SINGLE_NODE_VIEW,
  }
}

export function toggleClusterState (_id: string) {
  return {
    type: TOGGLE_CLUSTER_STATE,
    payload: {
      _id,
    },
  }
}

export function zoomIn () {
  return {
    type: ZOOM_IN,
  }
}

export function zoomOut () {
  return {
    type: ZOOM_OUT,
  }
}

export function centerOnFocused () {
  return {
    type: CENTER_ON_FOCUSED,
  }
}

export function openLinkPreviewWindowFor (payload: any) {
  return {
    type: OPEN_LINK_PREVIEW_WINDOW_FOR,
    payload,
  }
}

export function restorePath (pathId: string) {
  return {
    type: RESTORE_PATH,
    payload: {
      pathId,
    },
  }
}

export function updateNodes (nodes: Node) {
  return {
    type: UPDATE_NODES,
    payload: {
      nodes,
    },
  }
}

export function restoreSavedPath (pathId: string, maxExpandIndex: number, path: any) {
  return {
    type: RESTORE_SAVED_PATH,
    payload: {
      pathId,
      maxExpandIndex,
      path,
    },
  }
}

export function focusChild (payload:any) {
  return {
    type: FOCUS_CHILD,
    payload,
  }
}

export function exportTopics (name: string) {
  return {
    type: EXPORT_TOPICS,
    name: name,
  }
}

export function previousHistory () {
  return {
    type: HISTORY_PREV,
  }
}

export function nextHistory () {
  return {
    type: HISTORY_NEXT,
  }
}

export function childrenLoading (nodeId: string) {
  return {
    type: CHILDREN_LOADING,
    payload: {
      nodeId,
    },
  }
}

export function childrenPreLoaded (loaded: boolean) {
  return {
    type: CHILDREN_PRE_LOADED,
    payload: {
      loaded,
    },
  }
}
