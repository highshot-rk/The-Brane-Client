export type Property = {
  _id: string,
  title: string,
  value: any,
  cluster: string,
}

export interface FocusedNodeProperty extends Property {
  color: string,

  // TODO: seems unused
  symbol: string,
}

export type FocusedNodeProperties = {
  [index: string]: {
    topic: string,
    properties: FocusedNodeProperty[]
  }
}

export type PropertyMap = {
  [index: string]: Property
}

export type ActiveProperty = {
  _id: string,
  color: string,
  title: string,
  cluster: string,
  selectedValues: any[],
  // TODO: should be an enum
  sortDirection: string,
}
