import PropTypes from 'prop-types'

const tagList = PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.exact({
  title: PropTypes.string.isRequired,
  _key: PropTypes.string.isRequired,
})))

const child = {
  _id: PropTypes.string,
  title: PropTypes.string,
  _type: PropTypes.string,
  description: PropTypes.string,
  collapsed: PropTypes.bool,
  expanded: PropTypes.number,
  gateway: PropTypes.bool,
  parentCount: PropTypes.number,
  childCount: PropTypes.number,
  linkDirection: PropTypes.oneOf(['child']),
  linkType: PropTypes.string,
  linkId: PropTypes.string,
  tagList: tagList.isRequired,
}

export const node = PropTypes.exact({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  _type: PropTypes.string.isRequired,
  from: PropTypes.objectOf(PropTypes.exact({
    angle: PropTypes.number.isRequired,
    isParent: PropTypes.bool,
    gateway: PropTypes.bool,
    title: PropTypes.string,
    _id: PropTypes.string,
  })).isRequired,
  tagList: tagList.isRequired,
  parentCount: PropTypes.number,
  childCount: PropTypes.number,
  outgoing: PropTypes.arrayOf(PropTypes.exact(child)),
  x: PropTypes.number,
  y: PropTypes.number,
  angle: PropTypes.number,
  originallyFrom: PropTypes.string,
  description: PropTypes.string,
  invertCluster: PropTypes.bool,
  orbitLocked: PropTypes.bool,
  imageUrl: PropTypes.string,
  isUserNode: PropTypes.bool,
  parentsAsChildren: PropTypes.number,
  openPositions: PropTypes.arrayOf(PropTypes.number),
  vennIds: PropTypes.arrayOf(PropTypes.string),
  children: PropTypes.objectOf(PropTypes.exact(child)),
})
