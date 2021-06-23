const { createApi } = require('./api')
const registerInjector = require('../injectData').registerInjector

function findChild (children, key) {
  return children.find(child => child._key === key)
}

const injector = {
  name: 'clusters',
  cacheDuration: 1000 * 60 * 10, // cache for 10 minutes
  getData: async (graphName) => {
    const api = createApi(graphName)
    const { data: tags } = await api.get('tags')

    // families are the top-level tags
    const families = []

    Object.values(tags).forEach(tag => {
      let children = families

      for (let i = tag.length - 1; i > -1; i--) {
        let entry = tag[i]
        let child = findChild(children, entry._key)

        if (!child) {
          child = {
            _key: entry._key,
            title: entry.title,
            children: [],
          }
          children.push(child)
        }

        children = child.children
      }
    })

    return families
  },
}

registerInjector(injector)
