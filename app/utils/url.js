/**
 * Makes sure the url includes a protocol. For example, converts `www.google.com` to `http://wwww.google.com`
 * Does nothing when the url already contains a protocol.
 * @param {String} url
 * @param {String} defaultProtocol protocol to prepend url with if it is missing one. Defaults to "http"
 * @returns {String} url with protocol
 */
export function ensureProtocol (url, defaultProtocol = 'http') {
  if (!/^https?:\/\//.test(url)) {
    url = `${defaultProtocol}://${url}`
  }

  return url
}
