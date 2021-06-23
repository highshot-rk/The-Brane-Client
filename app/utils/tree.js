/**
 * Performs a depth-first traversal of the tag tree
 * @param {*} children
 * @param {*} cb
 */
export function walkTagTree (children, cb, path = []) {
  if (!children || !Array.isArray(children)) {
    return
  }

  return children.forEach(child => {
    if (child.children.length > 0) {
      walkTagTree(child.children, cb, path.concat([child]))
    }

    cb(child, path.concat([child]))
  })
}
