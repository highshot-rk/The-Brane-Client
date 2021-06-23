import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IconRegistry } from './create'
import './Add'
import './Filter'
import './SmallFilter'
import './Arrow'
import './Brane'
import './Export'
import './Property'
import './Search'
import './Close'
import './DefaultSort'
import './Ascending'
import './Descending'
import './LinkStraight'

export default class Icon extends Component {
  static propTypes = {
    name: PropTypes.string,
  }
  render () {
    const {
      name,
    } = this.props
    const Icon = IconRegistry[name]
    if (Icon) {
      return <Icon {...this.props} />
    } else {
      console.log(`unknown icon: ${name}`)
      return null
    }
  }
}
