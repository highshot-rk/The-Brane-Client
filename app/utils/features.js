const isIncomplete = process.env.DISABLE_INCOMPLETE === 'true'

const features = {
  expandContentWindow: !isIncomplete,
  socialLogin: false,
  newsletter: false,
  userMenu: !isIncomplete,
  verifyEmail: true,
  userTypes: !isIncomplete,
  accounts: true,
  savedPaths: false,
  buildMenu: false,
  vennSearch: true,
  uploadImages: false,
  linkContentWindow: true,
  filters: true,
  linkViewCount: !isIncomplete,
  profileSidebar: false,
  profileActivity: false,
  profilePublications: false,
  dropup: false,
  follow: false,
  contentStats: false,
  editNodeOrLink: false,
  contentWindowMoreOptions: false,
  addLinkOrNode: true,
  clusterState: false,
  indexedDbCache: false,
  onBoardingQuestions: !isIncomplete,
  export: true,
  lineageKeyboardShortcuts: false,
}

/**
 * Allows disabling features
 * @param {String} name name of feature
 * @returns {Bool} true if feature enabled
 */
export function featureEnabled (name) {
  if (name in features) {
    return features[name]
  }

  console.warn(`Unknown feature ${name}`)
  return true
}
