import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Text } from './elements'

export default class Welcome extends Component {
  static propTypes = {
    firstName: PropTypes.string,
  }
  render () {
    let nameText = ''

    if (this.props.firstName) {
      nameText = `, ${this.props.firstName}`
    }

    return (
      <Text>Welcome to The Brane{nameText}</Text>
    )
  }
}
