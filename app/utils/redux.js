import { createSelector as _createSelector } from 'reselect'
import { registerSelectors } from 'reselect-tools'
import { batchedSubscribe as _batchedSubscribe } from 'redux-batched-subscribe'

export function createSelector (name, ...props) {
  if (typeof name !== 'string') {
    console.warn('createSelector name must be a string')
  }
  const selector = _createSelector(...props)

  registerSelectors({
    [name]: selector,
  })

  return selector
}

let notifySubscribers = null
let paused = false

export function pauseSubscribe () {
  paused = true
}

export function resumeSubscribe () {
  if (paused && notifySubscribers) {
    notifySubscribers()
  }

  notifySubscribers = null
  paused = false
}

export function batchedSubscribe () {
  return _batchedSubscribe((notify) => {
    if (paused) {
      notifySubscribers = notify
    } else {
      notify()
    }
  })
}
