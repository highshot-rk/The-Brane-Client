import PropTypes from 'prop-types'
import React, { Component } from 'react'

// Basic, un-styled checkbox that also has an indeterminate state
export default class IndeterminateCheckbox extends Component {
  static propTypes = {
    indeterminate: PropTypes.bool,
    onChange: PropTypes.func,
    disabled: PropTypes.bool,
    checked: PropTypes.bool,
  }
  checkbox = null
  render () {
    return <input
      type='checkbox'
      ref={checkbox => { this.checkbox = checkbox }}
      onChange={this.props.onChange}
      disabled={this.props.disabled}
      checked={this.props.checked || false}
    />
  }
  setIndeterminate () {
    if (this.checkbox) {
      this.checkbox.indeterminate = this.props.indeterminate
    }
  }
  componentDidMount () {
    this.setIndeterminate()
  }
  componentDidUpdate () {
    this.setIndeterminate()
  }
}
