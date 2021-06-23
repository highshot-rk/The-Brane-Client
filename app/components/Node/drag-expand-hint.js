import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  degreesToRadians,
  circlePointFromAngle,
  circleRight0,
} from '../../utils/math'
import {
  ExpandHintText,
} from './elements'
import { ClusterIcon } from './icons'

export default class DragExpandHint extends Component {
  static propTypes = {
    quadrant: PropTypes.number,
    centerRadius: PropTypes.number,
    isCluster: PropTypes.bool,
    x: PropTypes.number,
    y: PropTypes.number,
    radius: PropTypes.number,
    downText: PropTypes.string,
  }
  render () {
    const hintRadius = this.props.radius + 150
    const angle = circleRight0(degreesToRadians(this.props.quadrant))
    const hintStart = circlePointFromAngle(
      angle,
      this.props.centerRadius
    )
    const hintStop = circlePointFromAngle(
      angle,
      hintRadius
    )

    let textAngleAdjustment = this.props.quadrant > 180 ? 90 : -90
    let clusterPosX = this.props.quadrant > 180 ? hintStop.x - 55 : hintStop.x - 40
    if (this.props.quadrant === -1) clusterPosX -= 7
    let clusterPosY = hintStop.y - 55
    let strokeColor = '#19B7D8'
    let fillColor = '#266572'
    let circleRadius = 32

    return (
      <g transform={`translate(${this.props.x},${this.props.y})`}>
        <ExpandHintText
          textAnchor='middle'
          transform={`rotate(${this.props.quadrant + textAngleAdjustment})`}
          x={hintStart.x + hintStop.x / 2}
          y={-10}
        >{this.props.downText}</ExpandHintText>
        <line
          x1={hintStart.x}
          y1={hintStart.y}
          x2={hintStop.x}
          y2={hintStop.y}
          strokeWidth='3'
          stroke={strokeColor}
          strokeDasharray='5 5'
          style={{ opacity: 0.4 }}
        />
        {
          this.props.isCluster
            ? <ClusterIcon
              hint
              posX={clusterPosX}
              posY={clusterPosY}
              fill={fillColor}
              r={circleRadius} />
            : <circle
              fill={fillColor}
              r={circleRadius}
              cx={hintStop.x}
              cy={hintStop.y}
            />
        }
      </g>
    )
  }
}
