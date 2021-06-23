export default function promiseProgress (_promises, onProgress) {
  let done = 0

  const promises = _promises.map(promise =>
    promise.then((result) => {
      done += 1
      onProgress(Math.floor(done / promises.length * 100))

      return result
    })
  )

  return Promise.all(promises)
}
