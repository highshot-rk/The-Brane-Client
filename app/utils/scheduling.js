// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from 'react-dom'

/* Waits until the browser is idle, selecing the best
 * api the browser supports.
 */
export function waitUntilIdle (func, maxDelay = 1000) {
  if (window.requestIdleCallback) {
    // Chrome and FireFox
    window.requestIdleCallback(func, { timeout: maxDelay })
  } else if (window.setImmediate) {
    // Edge
    window.setImmediate(func)
  } else {
    // Safari
    setTimeout(func, 40)
  }
}

/**
 * Uses unstable_batchedUpdates function from react-dom
 * React wraps event handlers on components with it to avoid
 * rerendering from multiple state changes. Event handlers set on the body,
 * or dispatching multiple times from a saga will cause multiple renders.
 * Wrapping that code with batch fixes it.
 */
export function batch (func) {
  return unstable_batchedUpdates(func)
}
