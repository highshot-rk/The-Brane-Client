import {
  SHOW,
  HIDE,
  TOGGLE_LINK_SIDEBAR,
  HIDE_NODE_CREATION_DETAILS,
  LOAD_IMAGE,
} from './constants'

export function show (id, name = null, creationDetails) {
  return { type: SHOW,
    payload:
      {
        id,
        name,
        creationDetails,
      },
  }
}

export function hide () {
  return { type: HIDE }
}

export function loadImage ({ url, description }) {
  return {
    type: LOAD_IMAGE,
    payload: {
      url,
      description,
    },
  }
}

export function toggleLinkSidebar () {
  return { type: TOGGLE_LINK_SIDEBAR }
}

export function hideNodeCreationDetails () {
  return {
    type: HIDE_NODE_CREATION_DETAILS,
  }
}
