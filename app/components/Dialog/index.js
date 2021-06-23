import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Wrapper,
  Window,
  Content,
  Button,
  Title,
} from './elements'
import { ESCAPE, ENTER } from 'utils/key-codes'

export default class Dialog extends Component {
  onClick = (button) => {
    this.props.onClick(button)
  }
  buttonRoles = () => {
    const buttons = this.props.buttons
    let cancel
    let submit

    if (buttons.length > 2) {
      return {
        cancel,
        submit,
      }
    }

    if (buttons.length === 1) {
      submit = buttons[0]
    } else if (buttons.find(button => button.negative)) {
      cancel = buttons.find(button => button.negative)
      submit = buttons.find(button => !button.negative)
    } else if (buttons.every(button => typeof button === 'string')) {
      cancel = buttons[0]
      submit = buttons[1]
    }

    return {
      cancel,
      submit,
    }
  }

  render () {
    const {
      text,
      buttons,
      title,
    } = this.props

    const normalizedButtons = buttons.map((button, index) => {
      if (typeof button === 'string') {
        return {
          id: button,
          text: button,
          style: index === buttons.length - 1 ? 'cta' : 'normal',
          negative: false,
        }
      }

      return {
        id: `${button.text}-${button.style}`,
        text: button.text,
        style: button.style || 'normal',
        negative: button.negative,
      }
    })

    return (
      <Wrapper>
        <Window>
          {title && <Title>{title}</Title>}
          <Content>{text}{this.props.children}</Content>
          {
            normalizedButtons.map((button, i) => {
              return (
                <Button
                  key={button.id}
                  buttonStyle={button.style}
                  negative={button.negative}
                  onClick={this.onClick.bind(this, button.text)}>
                  {button.text}
                </Button>)
            })
          }
        </Window>
      </Wrapper>
    )
  }
  documentKeyHandler = (e) => {
    const {
      submit,
      cancel,
    } = this.buttonRoles()

    switch (e.keyCode) {
      case ESCAPE:
        if (cancel) {
          this.onClick(cancel.text || cancel)
        }
        break
      case ENTER:
        if (submit) {
          this.onClick(submit.text || submit)
        }
        break

      // no default
    }
  }
  componentWillMount () {
    document.addEventListener('keydown', this.documentKeyHandler)
  }
  componentWillUnmount () {
    document.removeEventListener('keydown', this.documentKeyHandler)
  }
}

Dialog.propTypes = {
  onClick: PropTypes.func.isRequired,
  text: PropTypes.string,
  title: PropTypes.string,
  buttons: PropTypes.arrayOf(PropTypes.shape({
    style: PropTypes.oneOf(['normal', 'cta', 'transparent']),
    negative: PropTypes.bool,
    text: PropTypes.string.required,
  })),
}
