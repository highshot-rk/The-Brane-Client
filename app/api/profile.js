import api from './'
import {
  removeStaleDocuments,
} from './cache'

const KEY = '__current-user__'

// TODO: once the api accepts it, use a provided user key
export function getUserProfile () {
  return api.get('profile', {
    cache: {
      keys: [KEY],
    },
  })
}

export function updateUserProfile ({
  fn,
  ln,
  bio,
  social,
  location,
}) {
  removeStaleDocuments(KEY)
  return api.push('profile', {
    fn,
    ln,
    bio,
    social,
    location,
  })
}

export function getFollowing () {
  return api.get('profile/following', {
    cache: {
      ttl: 0,
    },
  })
}

export function getUserFollowers (userKey) {
  return api.get(`profile/following/${userKey}`, {
    cache: {
      ttl: 0,
    },
  })
}

export function getUserFollowing (userKey) {
  return api.get(`profile/followers/${userKey}`, {
    cache: {
      ttl: 0,
    },
  })
}

export function followUser (userKey) {
  removeStaleDocuments(KEY)

  return api.get(`profile/follow/${userKey}`, {
    cache: {
      ttl: 0,
    },
  })
}

export function unFollowUser (userKey) {
  removeStaleDocuments(KEY)

  return api.get(`profile/unfollow/${userKey}`, {
    cache: {
      ttl: 0,
    },
  })
}

export function getUserPublications (userKey) {
  return api.get(`profile/${userKey}/publications`, {
    cache: {
      ttl: 0,
    },
  })
}
