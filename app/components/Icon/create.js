import React, { Component } from 'react'
import PropTypes from 'prop-types'

export const IconRegistry = Object.create(null)

export default function createIconComponent ({
  name,
  content,
  contentProps,
  viewBox = '0 0 32 32',
}) {
  const icon = class Icon extends Component {
    static propTypes = {
      width: PropTypes.number,
      height: PropTypes.number,
      className: PropTypes.string,
      style: PropTypes.object,
      ...contentProps,
    }
    render () {
      const {
        width,
        height,
        className,
        onClick,
        style,
        ..._contentProps
      } = this.props

      return (
        <svg style={style} viewBox={viewBox} onClick={onClick} className={className} width={width} height={height}>
          {content(_contentProps)}
        </svg>
      )
    }
  }

  IconRegistry[name] = icon

  return icon
}
