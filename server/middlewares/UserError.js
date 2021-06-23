// This error class should be used for errors that should be visible
// to users
// Currently only used by data injectors
module.exports = class UserError extends Error {
  constructor (message) {
    super(message)

    this.name = 'UserError'
  }
}
