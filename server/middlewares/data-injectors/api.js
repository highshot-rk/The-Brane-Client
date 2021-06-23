const axios = require('axios')
const {
  API_URL,
  LOCAL_API_URL,
  LOCAL_GRAPH_NAMES,
  IS_PROD,
  GRAPH_API_URL,
} = require('../../../config')
const UserError = require('../UserError')

module.exports.createApi = function createApi (graphName) {
  return axios.create({
    baseURL: module.exports.getTopicsUrl(graphName),
  })
}

module.exports.getTopicsUrl = function (graphName) {
  if (!IS_PROD && LOCAL_GRAPH_NAMES.includes(graphName)) {
    return `${LOCAL_API_URL}/${graphName}/`
  }

  return `${API_URL}/${graphName}/`
}

const graphApi = axios.create({
  baseURL: GRAPH_API_URL,
})

module.exports.getRootTopic = async function (graphName) {
  if (!graphName) {
    throw new Error('undefined graph name')
  }

  const api = module.exports.createApi(graphName)
  const { data: result } = await api.get(`topics?type=system`)
  const rootNodes = result._embedded.systems

  if (!rootNodes || rootNodes.length === 0) {
    console.dir(result)
    throw new UserError('Graph is missing a root node')
  }
  if (rootNodes.length > 1) {
    console.dir(result)
    throw new UserError('Can only be one node with the "system" type')
  }

  return rootNodes[0]
}

module.exports.getGraph = async function (graphName) {
  const result = await graphApi.get(`graphs?name=${graphName}`)
  return result.data
}
