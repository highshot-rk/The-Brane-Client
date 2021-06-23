// Create canvas so we can reuse it
// TODO: create it the first time it is needed
const context = document.createElement('canvas').getContext('2d')

/**
 * Returns width of text
 * @param {*} text
 * @param {*} param1
 */
export function textWidth (text, {
  fontSize,
  fontFamily,
}) {
  context.font = `${fontSize} ${fontFamily}`

  return context.measureText(text).width
}
