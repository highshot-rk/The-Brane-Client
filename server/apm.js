const {
  APM_SERVICE_NAME,
  APM_SECRET,
  APM_URL,
} = process.env

module.exports = require('elastic-apm-node').start({
  active: process.env.NODE_ENV === 'production',
  serviceName: APM_SERVICE_NAME,
  secretToken: APM_SECRET,
  serverUrl: APM_URL,
})
