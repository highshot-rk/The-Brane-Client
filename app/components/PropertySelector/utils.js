import { upperCaseFirstLetter } from 'utils/strings'

export function prepareKey (key) {
  if (key === 'n') {
    return key
  }

  if (key === 'standardDeviation') {
    return 'Std. Deviation'
  }

  return upperCaseFirstLetter(key)
}
