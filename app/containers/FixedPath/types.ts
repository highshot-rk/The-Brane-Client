// The available angles a node can be expanded to.
// Sometimes it uses -45 and 405 for the comparison to work correctly
export type Quadrant = 45 | 135 | 225 | 315 | -45 | 405

export type LinkAnimationType = 'show' | 'hide'

// todo: rename to NodeSource
export type NodeFrom = {
  gateway?: boolean,
  _id: string,
  title: string,
  angle: Quadrant,
  isParent: boolean,
}

export type Tag = {
  _key: string,
  title: string
}

export type TagPath = Tag[]

export interface Topic {
  _id: string,
  _type: string,
  title: string,
  definitition?: string,
  childCount: number,
  parentCount: number,
  tagList: TagPath[],
}

export interface Node extends Topic {
  openPositions: Array<Quadrant>,
  secondOpenPositions: Array<number>,
  originallyFrom: string,
  collapsed: boolean,
  orbitLocked: boolean,
  hasCollapsed: boolean,
  angle: Quadrant,
  from: {
    [index: string]: NodeFrom
  },
  split?: boolean,
  branchLength?: number,
  miniCluster?: {
    selected: boolean | undefined,
    collapsible: boolean | undefined,
  },
  childCount: number,
  parentCount: number,
  vennIds: Array<Object>,
  invertCluster?: boolean,
  tagList: TagPath[],

  // TODO: remove since it currently isn't used or find a different implementation
  totalNodes?: number,

  // TODO: remove these since they aren't used
  imageUrl?: string,
  isUserNode?: boolean,
}

export interface Relative extends Topic {
  gateway?: boolean,
  expanded?: number,
  collapsed: boolean,

  // Added by a mutation in childPositions
  focused?: boolean,

  selectedCluster?: boolean,
  linkType: string,
  linkDirection: 'child' | 'parent',
  linkName: string,
  miniCluster?: {
    selected: boolean | undefined,
    collapsible: boolean | undefined,
  },
  branchLength?: number,
  angle?: number,
}

export interface NodeWithRelatives extends Node {
  relatives: {
    [index: string]: Relative
  }
}

export interface FocusedNode extends Node {
  relatives: Relative[]
}

export interface LayoutNode extends NodeWithRelatives {
  x: number,
  y: number
}

export interface SourceNode extends LayoutNode {
  outgoing: Relative[]
}

export type RelativeMap = {
  [index: string]: Relative
}

export interface SourceNodeMap {
  [index: string]: SourceNode
}

export type LayoutLink = {
  targetID: string,
  sourceID: string,
  x1: number,
  x2: number,
  y1: number,
  y2: number,
  reversed: boolean,
}

export type BranchDetails = {
  length: number,
  newestIndex?: number,
  _id: string,
}

export type BranchEntry = {
  _id: string,
  title: string,
  branchOffs?: BranchEntry[],
  branchOut?: boolean
}

export type ReorderedRelative = {
  _id: string,
  index: number,
}

export type NodeAnimation = {
  // TODO: figure out why some places use id instead of _id
  _id?: string,
  delay?: number,
  type: 'hide' | 'show'
}

export type BranchPipelineConfig = {
  id: string,
  show: boolean
}

export type SingleNodeViewConfig = {
  _id: string,
  show: boolean,
  prepared: boolean
}

export type PathAnimation = {
  id: number,
  follow: number,
  nodes: {
    [index: string]: NodeAnimation
  }
}

export type NodeMenuConfig = {
  node: {
    _id: string,
  },
  parentId: string,
  isChild: boolean,
  x: number,
  y: number,
}

export type NodePosition = {
  node: Relative,
  angle: number,
  side: 'left' | 'right' | 'top',
  faded?: boolean,
  x?: number,
  y?: number,
  dragged?: boolean,
  miniCluster?: boolean,
}

export type SideStatus = 'empty' | 'half' | 'full'

export type ShowOnOrbit = 'children' | 'parents' | 'all'

export type ExpandedMiniClusters = {
  [index: string]: string
}
