const registerInjector = require('../injectData').registerInjector

const injector = {
  name: 'graphName',
  cacheDuration: 1000, // cache for 1 second
  async getData (graphName) {
    return graphName
  },
}

registerInjector(injector)
