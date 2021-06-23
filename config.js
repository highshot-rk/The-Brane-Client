module.exports = {
  // In development, the graphs listed in LOCAL_GRAPH_NAMES will use the
  // local api, and rest of the graphs will use API_URL.s
  API_URL: 'http://topics-api.staging.thebrane.com',
  LOCAL_API_URL: 'http://localhost:8080',
  LOCAL_GRAPH_NAMES: ['sandbox', 'dev'],
  // Temp fix
  // USERS_API_URL: process.env.USERS_API || 'https://thebrane-auth-api.scsp.dev',
  USERS_API_URL: 'https://thebrane-users-api.vercel.app',
  // Currently handled by the old users api
  GRAPH_API_URL: process.env.GRAPH_API_URL || 'https://users-api.staging.thebrane.com',
  CONTENTS_API_URL: process.env.BRANE_CONTENTS_API || 'http://localhost:8082/contents',

  IS_PROD: process.env.NODE_ENV === 'production',
}
