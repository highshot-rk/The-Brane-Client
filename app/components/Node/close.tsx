import { CloseButton } from './elements'
import React from 'react'
import * as KEYBOARD_CODES from 'utils/key-codes'

type Props = {
  x: number,
  y: number,
  onClose: () => void
}

export default class Close extends React.Component<Props, {}> {
  componentWillMount () {
    document.addEventListener('keydown', this.keyDownHandler)
  }
  componentWillUnmount () {
    document.removeEventListener('keydown', this.keyDownHandler)
  }

  keyDownHandler = (event: KeyboardEvent) => {
    switch (event.keyCode) {
      case KEYBOARD_CODES.ESCAPE:
        this.props.onClose()
        break
    }
  }

  render () {
    return (
      <CloseButton x={this.props.x} y={this.props.y} onClick={this.props.onClose}>
        <circle r={28} />
        <text dy='12px'>&times;</text>
      </CloseButton>
    )
  }
}
