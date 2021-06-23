const registerInjector = require('../injectData').registerInjector
const {
  USERS_API_URL,
  CONTENTS_API_URL,
} = require('../../../config')
const {
  getTopicsUrl,
} = require('./api')

const injector = {
  name: 'apiUrls',
  cacheDuration: 1000, // cache for 1 second
  async getData (graphName) {
    return {
      apiUrl: getTopicsUrl(graphName),
      usersApiUrl: USERS_API_URL,
      contentsApiUrl: CONTENTS_API_URL,
    }
  },
}

registerInjector(injector)
