/**
 * Returns a function that caches promises returned by the method
 * When the function is called with the same arguments a second time, returns
 * the cached promise instead of running the method
 *
 * In the future, this might removed cached promises after a certain amount of time
 *
 * @param {Function} method
 */
export function memoize (method, { maxAge }) {
  const cache = {}

  if (maxAge !== undefined && maxAge > -1) {
    setInterval(() => {
      const tooOld = Date.now() - maxAge

      Object.keys(cache).forEach(key => {
        if (cache[key] && cache[key].time < tooOld) {
          cache[key] = null
        }
      })
    }, maxAge / 2)
  }

  return function (...args) {
    let key = JSON.stringify(args)

    if (!cache[key]) {
      cache[key] = {
        time: Date.now(),
        value: method(...args),
      }
    }

    return cache[key].value
  }
}
