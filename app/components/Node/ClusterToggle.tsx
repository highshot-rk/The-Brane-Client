import React, { Component } from 'react'
import {
  ClusterIcon,
} from './icons'

type Props = {
  radius: number,
  expanded: boolean
}

export default class ClusterToggle extends Component <Props> {
  render () {
    const {
      radius,
      expanded,
    } = this.props

    return (
      <>
        <ClusterIcon fill='none' outline r={radius} />
        <text x={expanded ? -3 : -4} y={7}>
          {expanded ? '-' : '+'}
        </text>
      </>
    )
  }
}
