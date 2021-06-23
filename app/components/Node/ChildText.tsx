import React, { Component } from 'react'
import { C01_BLACK } from 'styles/colors'
import { Relative } from 'containers/FixedPath/types'
import { FocusedNodeProperty } from 'containers/PropertySidebar/types'

type Props = {
  side: string,
  node: Relative,
  properties: FocusedNodeProperty[],
  parentTitle: string,
  maxTitleLength: number,
}

export default class ChildText extends Component <Props> {
  textPosition () {
    const {
      side,
      node: {
        angle,
      },
    } = this.props

    if (side === 'left' || angle > Math.PI) {
      return {
        textX: -29,
        textY: 4,
        anchor: 'end',
      }
    } else if (side === 'right' || (angle < Math.PI && angle > 0.2)) {
      return {
        textX: 29,
        textY: 4,
        anchor: 'start',
      }
    } else {
      // node is at very top of orbit
      return {
        textX: 0,
        textY: -22,
        anchor: 'middle',
      }
    }
  }

  prepareValue (value: any) {
    if (value instanceof Date) {
      return value.toLocaleDateString()
    }

    return value
  }

  createPropertyText () {
    const {
      properties = [],
    } = this.props

    return properties.map((property, index) => {
      return [
        <tspan fill={property.color} key={index}>{' '}{this.prepareValue(property.value)}{property.symbol} {' '}</tspan>,
        (index < properties.length - 1) ? ' | ' : null,
      ]
    })
  }

  render () {
    let {
      node: {
        title = '',
        childCount,
        parentCount,
        focused,
        miniCluster,
      },
      // parentTitle,
      maxTitleLength,
      side,
    } = this.props
    const origTitle = title

    if (title.length > maxTitleLength) {
      // remove parent title from child title
      // title = title.replace(new RegExp(`(^|\\s)${parentTitle}($|\\s)`, 'gi'), ' ')
      // remove text in parenthesis
      title = title.replace(/\s*\(.*?\)\s*/g, '')
      title.trim()

      if (title.length > maxTitleLength) {
        title = title.slice(0, maxTitleLength - 4)
        // sometimes it ends with a space
        title.trim()
        title += '...'
      }
    }

    if (childCount > 0 || parentCount > 0) {
      // TODO: when only parents or children are shown on orbits, the count should
      // reflect that
      title += ` (${childCount + parentCount})`
    }

    const {
      textX,
      textY,
      anchor,
    } = this.textPosition()
    const contents = [
      this.createPropertyText(),
      title,
    ]

    if (side === 'right') {
      contents.reverse()
    }

    return (
      <text
        fill={focused ? C01_BLACK : ''}
        x={textX}
        fontWeight={miniCluster ? 'bold' : 'normal'}
        y={textY}
        textAnchor={anchor}
      >
        {origTitle.length > maxTitleLength && <title>{origTitle}</title>}
        {contents}
      </text>
    )
  }
}
