export function symbolFromQueryType (type) {
  switch (type) {
    case 'intersection':
      return String.fromCharCode(8745)
    case 'union':
      return String.fromCharCode(8746)
    case 'difference':
      return String.fromCharCode(8710)
    case 'subtraction':
      return '-'
    case 'open-parenthesis':
      return '('
    case 'close-parenthesis':
      return ')'
    default:
      return ''
  }
}
