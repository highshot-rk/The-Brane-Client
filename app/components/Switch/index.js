import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  SwitchWrapper,
} from './elements'

export default class Switch extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    onChange: PropTypes.func,
  }

  render () {
    const {
      checked,
      onChange,
    } = this.props

    return (
      <SwitchWrapper>
        <input type='checkbox' checked={checked} onChange={onChange} />
        <div className='slider' />
      </SwitchWrapper>
    )
  }
}
