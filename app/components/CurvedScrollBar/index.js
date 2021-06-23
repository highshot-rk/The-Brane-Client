import { Thumb, Track, Scrollbar } from './elements'

import PropTypes from 'prop-types'

import React from 'react'
import { arc } from 'd3-shape'

const TOP_DEG = 345
const BOTTOM_DEG = 195
const TRACK_LENGTH = TOP_DEG - BOTTOM_DEG

export default class CurvedScrollBar extends React.Component {
  isMouseDown = false
  prevMousePos = { x: 0, y: 0 }

  onScroll = e => {
    if (!this.props.overlayOpen) {
      this.mouseMove({ event: e, isWheel: true })
    }
  }

  componentWillMount () {
    document.body.addEventListener('wheel', this.onScroll, true)
  }

  componentWillUnmount () {
    document.body.removeEventListener('wheel', this.onScroll, true)
  }

  componentWillReceiveProps (newProps) {
    const { nodes, focusedChild } = newProps
    const { thumbLength } = this.calculations()
    const step = thumbLength
    if (focusedChild) {
      const focusedIndex = nodes.findIndex(node => node.key === focusedChild._id)
      let prevFocusedIndex = null
      if (this.props.focusedChild) {
        prevFocusedIndex = nodes.findIndex(node => node.key === this.props.focusedChild._id)
      }
      if (focusedIndex && prevFocusedIndex && prevFocusedIndex !== focusedIndex) {
        let deltaY = null
        if (focusedIndex < nodes.length / 2 && !focusedChild.forward) {
          deltaY = -step
        }
        if (focusedChild.forward && focusedIndex >= nodes.length / 2 && focusedIndex <= nodes.length - 1) {
          deltaY = step
        }
        deltaY && this.mouseMove({ event: { deltaY }, isWheel: true })
      }
    }
  }

  mouseDown = (e) => {
    this.isMouseDown = true
    this.prevMousePos = {
      x: e.pageX,
      y: e.pageY,
    }
    document.body.addEventListener('mousemove', this.mouseMove, true)
    document.body.addEventListener('mouseup', this.mouseUp, true)
  }

  getScrollPosition = positionY => {
    const { rangeLength, pixelHeight } = this.calculations()
    const pixelScrollHeight = (rangeLength / TRACK_LENGTH) * pixelHeight
    const dragDistancePercentage = (positionY - this.prevMousePos.y) / pixelScrollHeight
    let scrollPosition = this.props.scrollTop + dragDistancePercentage
    scrollPosition = Math.max(Math.min(scrollPosition, 1), 0)
    return scrollPosition
  }

  mouseMove = (e) => {
    if (this.isMouseDown) {
      const scrollPosition = this.getScrollPosition(e.pageY)
      this.props.onChange(scrollPosition)
      this.prevMousePos.y = e.pageY
    } else if (e.isWheel) {
      const deltaY = e.event.deltaY
      const up = deltaY > 0
      let positionY = this.prevMousePos.y
      const step = Math.abs(deltaY)
      if (!up) {
        if (this.prevMousePos.y >= step) {
          positionY -= step
        }
      } else {
        positionY += step
      }
      const scrollPosition = this.getScrollPosition(positionY)
      this.props.onChange(scrollPosition)
      this.prevMousePos.y = positionY
    }
  }

  mouseUp = () => {
    this.isMouseDown = false
    document.body.removeEventListener('mousemove', this.mouseMove, true)
    document.body.removeEventListener('mouseup', this.mouseUp, true)
  }

  noZero = (value) => {
    if (value === 0) {
      return Number.MIN_VALUE
    }
    return value
  }

  calculations = () => {
    const scrollTop = this.noZero(this.props.scrollTop)
    const height = this.noZero(this.props.height)
    const visibleHeight = this.noZero(this.props.visibleHeight)

    const thumbLength = Math.max(Math.min(visibleHeight / height * TRACK_LENGTH, TRACK_LENGTH), 5)
    const rangeLength = TRACK_LENGTH - thumbLength
    const pixelHeight = 2 * this.props.radius * Math.sin(TRACK_LENGTH * (Math.PI / 180) / 2)
    const pixelRangeLength = (rangeLength / TRACK_LENGTH) * pixelHeight
    const thumbTopDesiredY = (pixelHeight / 2) - (scrollTop * pixelRangeLength)
    const thumbTopDesiredX = -1 * Math.sqrt(Math.pow(this.props.radius, 2) - Math.pow(thumbTopDesiredY, 2))
    const thumbTop = Math.atan2(thumbTopDesiredX, thumbTopDesiredY) * (180 / Math.PI)

    return {
      scrollTop,
      thumbLength,
      rangeLength,
      thumbTop,
      pixelHeight,
      pixelRangeLength,
      thumbTopDesiredX,
      thumbTopDesiredY,
    }
  }

  render () {
    const { thumbTop, thumbLength } = this.calculations()

    const arcPath = arc()
      .innerRadius(this.props.radius - 6)
      .outerRadius(this.props.radius + 5)
      .startAngle((thumbTop - thumbLength) * (Math.PI / 180))
      .endAngle(thumbTop * (Math.PI / 180))
      .cornerRadius(10)

    return (
      <Scrollbar>
        <Track r={this.props.radius} />
        <Thumb onMouseDown={this.mouseDown} transform='translate(0, 0) rotate(0, 0, 0)' d={arcPath()} />
      </Scrollbar>
    )
  }
}

CurvedScrollBar.propTypes = {
  radius: PropTypes.number,
  height: PropTypes.number,
  scrollTop: PropTypes.number,
  visibleHeight: PropTypes.number,
  overlayOpen: PropTypes.bool,
  onChange: PropTypes.func,
  focusedChild: PropTypes.object,
}
