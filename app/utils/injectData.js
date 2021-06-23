export function getData (key) {
  const selector = `script[type="text/inject-data"][data-key="${key}"]`
  const el = document.querySelector(selector)
  try {
    return JSON.parse(decodeURIComponent(el ? el.textContent.trim() : ''))
  } catch (e) {
    if (e.message !== 'Unexpected end of JSON input') {
      console.error(e)
    } else {
      console.error(`Unable to parse injected data for ${key}. Check the server logs for errors`)
    }
    return {}
  }
}
