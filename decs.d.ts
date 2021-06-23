// These are all of the js files imported by the typescript files
// Since noImplicitAny is enabled, we have to manually specify any for these
// Eventually these will probably be typed, but for now this file allows us to
// reduce the scope of rewriting with typescript.

declare module 'utils/math'
declare module 'utils/filterNodes'
declare module 'utils/key-codes'
declare module 'posthog-js'

declare module 'utils/injectData' {
  export let getData: any
}

declare module 'utils/features' {
  export let featureEnabled: any
}

declare module 'utils/svg'
declare module 'utils/scheduling'
declare module 'styles/colors'
declare module 'utils/key-codes'
declare module 'components/Icons/default_profile.svg'
declare module 'components/Icon'
declare module 'components/CurvedScrollBar'

declare module 'containers/NodePreviewWindow/actions' {
  export let show: any
  export let hide: any
}

declare module 'components/LinkCreationOptionsDialog' {
  export let a: any;
  export default a;
}

declare module 'components/Node/drag-expand-hint'
declare module 'components/Node/drag-reorder-hint'
declare module 'components/Node/OrbitActions'

declare module 'containers/Auth/selectors' {
  export let selectAuth: () => { firstName: string }
}

declare module 'components/Welcome'

declare module 'containers/LineageTool/actions' {
  export let confirmRestorePath: any
}

declare module 'containers/PropertySidebar/selectors' {
  export let selectFocusedNodeProperties: any
  export let selectActiveProperties: any
}

declare module 'containers/HomePage/actions' {
  export let addProfileNode: any
  export let showNodeCreationWindow: any
  export let showLinkCreationWindow: any
}

declare module 'utils/tags'

declare module 'components/NodeMenuOverlay' {
  export let a: any
  export default a
}

declare module 'components/NodeMenu' {
  export let a: any
  export default a
}

declare module 'containers/LinkPreviewWindow/actions' {
  export let showPreview: any
  export let hidePreview: any
}

declare module 'components/BranchPipeline' {
  export let a: any
  export default a;
}

declare module 'containers/FilterMenu/selectors' {
  export let selectTagFilters: () => () => { _key: string, title: string }[][]
  export let selectShowOnOrbit: () => () => 'all' | 'children' | 'parents'
  export let selectFilterWithin: () => () => string
}

declare module 'containers/HomePage/selectors' {
  export let selectSidebarMenu: () => () => string
  export let selectNodeCreationWindow: any
  export let selectLinkCreationWindow: any
  export let selectNodeEditWindow: any
  export let selectLinkEditWindow: any
  export let selectWelcome: () => () => boolean
}

declare module 'containers/NodePreviewWindow/selectors' {
  export let selectShowNodePreviewWindow: any
}
