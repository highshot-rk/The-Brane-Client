export function missingFieldText (field) {
  const fieldUppercase = `${field[0].toUpperCase()}${field.slice(1)}`

  return `${fieldUppercase} is required`
}
