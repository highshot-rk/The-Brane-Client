const { getRootTopic, createApi } = require('./api')
const registerInjector = require('../injectData').registerInjector
const _ = require('lodash')

const injector = {
  name: 'root-node',
  cacheDuration: 1000 * 60, // cache for 1 minute
  async getData (graphName) {
    const rootNode = await getRootTopic(graphName)
    const api = createApi(graphName)
    const {
      data: links,
    } = await api.get(`${rootNode._id}/links?embed=true`)

    return {
      rootNode,
      links: _.flatten(Object.values(links._embedded)),
    }
  },
}

registerInjector(injector)
