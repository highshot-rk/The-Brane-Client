import PropTypes from 'prop-types'
import React, { Component } from 'react'

export default class DragReorderHint extends Component {
  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    side: PropTypes.string,
  }

  render () {
    const rectWidth = 100
    const rectHeight = 14
    const rectOffset = 20

    let rectY = -rectHeight / 2
    let rectX

    if (this.props.side === 'left') {
      rectX = -rectOffset - rectWidth
    } else {
      rectX = rectOffset
    }

    return (
      <g
        className={`node __related-node node__related-node--faded`}
        style={{ transition: '0.4s transform', transform: `translate(${this.props.x}px, ${this.props.y}px)` }}
      >
        <circle
          cx='0'
          cy='0'
          fill='#19B7D8'
          r='9'
        />

        <rect
          x='0'
          y='0'
          width={rectWidth}
          height={rectHeight}
          fill='#19B7D8'
          style={{ opacity: 0.5, transition: '0.6s transform', transform: `translate( ${rectX}px, ${rectY}px )` }}
        />
      </g>
    )
  }
}
