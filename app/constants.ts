import {
  getData,
} from 'utils/injectData'

let rootNodeData = getData('root-node')

export const GRAPH_NAME = getData('graphName')
export const BRANE_NODE_ID = rootNodeData.rootNode ? rootNodeData.rootNode._id : 0
export const INITIAL_PATH_ID = 0
export const ROOT_NODE_TITLE = rootNodeData.rootNode ? rootNodeData.rootNode.title : 'The Brane'
// TODO: this should instead be a topic _type instead of id
export const VENN_ID = 'topics/venn-search'

console.log(`Graph ${GRAPH_NAME} was injected`)
