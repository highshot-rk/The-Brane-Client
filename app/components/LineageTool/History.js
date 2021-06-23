import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { findDOMNode } from 'react-dom'
import {
  HistoryWrapper,
} from './elements'
import { waitUntilIdle } from 'utils/scheduling'

class History extends Component {
  static propTypes = {
    children: PropTypes.node,
  }
  componentDidUpdate () {
    waitUntilIdle(() => {
      this.scrollToActive()
    })
  }
  scrollToActive = () => {
    let domNode = findDOMNode(this).querySelector('#active')
    if (domNode) {
      domNode.scrollIntoView()
    }
  }
  render () {
    return (
      <HistoryWrapper>
        {this.props.children}
      </HistoryWrapper>
    )
  }
}

export default History
