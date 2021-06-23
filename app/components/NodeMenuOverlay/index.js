import { Overlay } from './elements'
import React from 'react'

export default class NodeMenuOverlay extends React.Component {
  render () {
    return (
      <g transform={`translate(${this.props.x}, ${this.props.y})`}>
        <Overlay
          x={-1 * window.innerWidth}
          y={-1 * window.innerHeight}
          width={2 * window.innerWidth}
          height={2 * window.innerHeight}
          onClick={this.props.hideMenu}
        />
      </g>
    )
  }
}
