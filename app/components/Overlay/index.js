import { Overlay as OverlayElement } from './elements'
import PropTypes from 'prop-types'
import React from 'react'
import * as keycodes from '../../utils/key-codes'

/*
 * Overlays the screen with a transparent dark element with a z-index of 50
 */
export default class Overlay extends React.Component {
  componentWillMount () {
    document.addEventListener('keydown', this.documentKeyHandler)
  }
  documentKeyHandler = (e) => {
    if (e.keyCode === keycodes.ESCAPE) {
      this.props.onClose()
    }
  }
  componentWillUnmount () {
    document.removeEventListener('keydown', this.documentKeyHandler, false)
  }
  render () {
    return (
      <OverlayElement transparent={this.props.transparent} onClick={this.props.onClose} />
    )
  }
}

Overlay.propTypes = {
  transparent: PropTypes.bool,
  onClose: PropTypes.func,
}
