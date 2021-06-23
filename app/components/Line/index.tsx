import React, { Component } from 'react'
import { radiansToDegrees } from 'utils/math'
import { featureEnabled } from 'utils/features'
import { LinkAnimationType } from 'containers/FixedPath/types'

type Props = {
  startX: number,
  stopX: number,
  startY: number,
  stopY: number,
  startID: string,
  stopID: string,
  showPreview: (startId: string, stopId: string) => void,
  menuShown?: boolean,
  animationType?: LinkAnimationType,
  reversedAngle?: boolean,
  delay?: number,
  nearFocused?: boolean,
}

export default class Line extends Component<Props, {}> {
  arrowPos () {
    const startX = this.props.startX
    const stopX = this.props.stopX
    const startY = this.props.startY
    const stopY = this.props.stopY

    const arrowX = (startX + stopX) / 2
    const arrowY = (startY + stopY) / 2

    return {
      arrowX,
      arrowY,
    }
  }

  showPreview = () => {
    if (featureEnabled('linkContentWindow')) {
      this.props.showPreview(this.props.startID, this.props.stopID)
    }
  }
  render () {
    let className = 'fixed-path-link '

    if (this.props.menuShown) {
      className += 'fixed-path-link--menu-shown '
    } else if (this.props.animationType === 'hide') {
      className += 'fixed-path-link--hide '
    }

    const startX = this.props.startX
    const stopX = this.props.stopX
    const startY = this.props.startY
    const stopY = this.props.stopY

    const { arrowX, arrowY } = this.arrowPos()
    const adjustment = this.props.reversedAngle ? -90 : 90
    const angle = radiansToDegrees(Math.atan2(stopY - startY, stopX - startX)) - adjustment

    return (
      <g className={className}
        style={{ animationDelay: `${this.props.delay}ms` }} >
        <line
          className='fixed-path-link__line'
          x1={startX}
          y1={startY}
          x2={stopX}
          y2={stopY}
          strokeWidth='2'
          stroke='rgba(256, 256, 256, 0.2)'
          strokeDasharray='3 8'
        />
        <line
          x1={startX}
          y1={startY}
          x2={stopX}
          y2={stopY}
          strokeWidth='20'
          stroke='transparent'
        />
        <g
          onClick={this.showPreview}
          className={`fixed-path-link__arrow ${this.props.nearFocused ? 'fixed-path-link__arrow--near-focused' : ''}`}
          transform={`translate(${arrowX - 12},${arrowY - 12}) scale(0.2, 0.2) rotate(${angle}, 60, 60)`}>
          <rect x={-50} y={-50} width={200} height={200} fill='transparent' />
          <circle id='Combined-Shape' stroke='#FEFEFE' strokeWidth='2.3' fill='#656565' cx='60' cy='60' r='42' />
          <path d='M78.8345183,52.5897708 C79.6155669,53.3708193 79.6206081,54.632108 78.8411463,55.4115699 L61.4103127,72.8424035 C60.6329247,73.6197915 59.3750075,73.6222694 58.5885136,72.8357754 L58.5885136,72.8357754 C57.807465,72.0547269 57.8024237,70.7934382 58.5818856,70.0139763 L76.0127192,52.5831428 C76.7901072,51.8057547 78.0480244,51.8032769 78.8345183,52.5897708 L78.8345183,52.5897708 Z' id='Rectangle' fill='#FEFEFE' />
          <path d='M40.5885136,52.5897708 C39.807465,53.3708193 39.8024237,54.632108 40.5818856,55.4115699 L58.0127192,72.8424035 C58.7901072,73.6197915 60.0480244,73.6222694 60.8345183,72.8357754 L60.8345183,72.8357754 C61.6155669,72.0547269 61.6206081,70.7934382 60.8411463,70.0139763 L43.4103127,52.5831428 C42.6329247,51.8057547 41.3750075,51.8032769 40.5885136,52.5897708 L40.5885136,52.5897708 Z' id='Rectangle' fill='#FEFEFE' />
        </g>
      </g>
    )
  }
}
