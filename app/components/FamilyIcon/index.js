import React, { Component } from 'react'
import PropTypes from 'prop-types'
import humanityIcon from './icons/humanity.svg'
import natureIcon from './icons/nature.svg'
import scienceIcon from './icons/science.svg'
import technologyIcon from './icons/technology.svg'

const icons = {
  Humanity: humanityIcon,
  Nature: natureIcon,
  Science: scienceIcon,
  Technology: technologyIcon,
}

export default class FamilyIcon extends Component {
  static propTypes = {
    family: PropTypes.string,
  }
  render () {
    if (!(this.props.family in icons)) {
      return null
    }

    return <img alt={this.props.family} src={icons[this.props.family]} />
  }
}
