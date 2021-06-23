export function upperCaseFirstLetter (string) {
  return `${string[0].toUpperCase()}${string.slice(1)}`
}

export function truncateString (title, maxLineCount) {
  if (title.length > maxLineCount) {
    return `${title.slice(0, maxLineCount)}...`
  }
  return title
}
