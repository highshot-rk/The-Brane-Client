import api from './'
import {
  removeStaleDocuments,
} from './cache'

export function removeImage (uploadKey) {
  removeStaleDocuments(uploadKey)

  return api.delete(`upload/${uploadKey}`)
}
