import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TabTextContent } from '../elements'

export default class Acknowledgement extends Component {
  static propTypes = {
    item: PropTypes.shape({
      additionalProperties: PropTypes.shape({
        acknowledgement: PropTypes.string,
      }),
    }),
  }

  render () {
    return (
      <TabTextContent>
        {this.props.item.additionalProperties.acknowledgement || 'Has no acknowledgement'}
      </TabTextContent>
    )
  }
}
