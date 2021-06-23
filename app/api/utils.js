import api from './'

export function uploadPicture (route, picture) {
  const config = {
    headers: { 'content-type': 'multipart/form-data' },
  }
  const data = new FormData()

  data.append('data', picture, picture.name)

  return api.post(route, data, config)
}

export function ensureKey (idOrKey) {
  if (idOrKey.indexOf('/') > -1) {
    return idOrKey.split('/')[1]
  }

  return idOrKey
}

export function ensureId (idOrKey, collection) {
  if (idOrKey.indexOf('/') > -1) {
    return idOrKey
  }

  return `${collection}/${idOrKey}`
}
