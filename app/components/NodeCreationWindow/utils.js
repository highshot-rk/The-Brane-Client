import {
  createLink,
} from 'api/link'

/**
 *
 * @param {Links} links Each link should have a category and link property
 */
export function createLinks (links, nodeKey, downLink = true) {
  return links.map(link => {
    const linkKey = link.category._key || link.category._id

    return createLink(
      downLink ? nodeKey : linkKey,
      downLink ? linkKey : nodeKey,
      link.verb,
    )
  })
}
