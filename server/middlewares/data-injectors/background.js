const registerInjector = require('../injectData').registerInjector
const {
  getGraph,
} = require('./api')

const injector = {
  name: 'background',
  cacheDuration: 1000 * 60 * 10, // cache for 10 minutes
  async getData (graphName) {
    // TODO: the background should be stored in the old users api
    // like for all of the other graphs
    if (graphName === 'endcorona-scanning') {
      return 'corona'
    }

    const graph = await getGraph(graphName)
    return graph.background
  },
}

registerInjector(injector)
