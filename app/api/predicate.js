// TODO: the name for this has changed a lot, check if it is still called predicates
import api from './'

export function getPredicates () {
  return api.get('nodes/verbs')
}
