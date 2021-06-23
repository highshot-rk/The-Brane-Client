import { uniqueId } from 'lodash-es'
/**
 * @param {String} file The path of the file you want to load.
 * @param {Function} callback (optional) The function to call when the script loads.
 * @param {String} id (optional) The unique id of the file you want to load.
 */
export const loadAsyncScript = (file, callback, id) => {
  const d = document
  if (!id) { id = uniqueId('async_script') }
  if (!d.getElementById(id)) {
    const tag = 'script'
    let newScript = d.createElement(tag)
    let firstScript = d.getElementsByTagName(tag)[0]
    newScript.id = id
    newScript.async = true
    newScript.src = file
    if (callback) {
      // IE support
      newScript.onreadystatechange = () => {
        if (newScript.readyState === 'loaded' || newScript.readyState === 'complete') {
          newScript.onreadystatechange = null
          callback(file)
        }
      }
      // Other (non-IE) browsers support
      newScript.onload = () => {
        callback(file)
      }
    }
    firstScript.parentNode.insertBefore(newScript, firstScript)
  } else {
    callback(new Error('already-loaded'))
    console.error(`The script with id ${id} is already loaded`)
  }
}
