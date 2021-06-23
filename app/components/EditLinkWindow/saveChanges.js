import { updateImage } from 'api/link'
import { removeImage } from 'api/upload'

export function saveChanges (data, originalData) {
  const promises = []
  // const parentKey = data.parentNode.node._key
  // const childKey = data.childNode.node._key
  const linkKey = data.linkDetails._key

  if (originalData.description !== data.description) {
    console.warn('Updating link description is not implemented')
    // promises.push(updateDescription(parentKey, childKey, data.description))
  }

  if (data.picture && data.picture.changed !== false) {
    promises.push(updateImage(linkKey, data.picture))
  } else if (data.uploads.length > 0 && !data.picture) {
    promises.push(
      ...data.uploads.map(upload => removeImage(upload._key))
    )
  }

  if (data.verb !== originalData.verb) {
    console.warn('Updating link type is not implemented')
    // const verb = data.verbs[Math.floor(data.verb / 2)]
    // promises.push(updateLinkVerb(parentKey, childKey, verb))
  }

  return promises
}
