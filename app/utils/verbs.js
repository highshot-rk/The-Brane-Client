/**
 * Finds the index of the flattened verbs, returning the index
 * of the down text if for a parent, or up text if for a child
 * @param {Array} verbs
 * @param {String} downtext
 * @param {String} uptext
 * @param {Bool} isParent
 */
export function getVerbFlatIndex (verbs, downtext, uptext, isParent) {
  for (let i = 0; i < verbs.length; i++) {
    let verb = verbs[i]

    if (verb[0] === downtext && verb[1] === uptext) {
      return i * 2 + (isParent ? 0 : 1)
    }
  }

  return isParent ? 0 : 1
}
