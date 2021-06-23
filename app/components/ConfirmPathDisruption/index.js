import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Dialog from '../Dialog'
import { BRANE_NODE_ID } from '../../constants'

export default class ConfirmPathDisruption extends Component {
  onClick = (button) => {
    switch (button) {
      case 'Cancel':
        this.props.cancel()
        break
      case 'Open':
        this.props.confirm(this.props.unconfirmedSearch)
    }
  }
  render () {
    const {
      unconfirmedSearch,
    } = this.props

    let title

    if (unconfirmedSearch.isUserNode) {
      title = 'your Home node'
    } else if (unconfirmedSearch._id === BRANE_NODE_ID) {
      title = 'The Brane'
    } else {
      title = unconfirmedSearch.title
    }

    return <Dialog
      text={`Clear current path and open ${title}`}
      buttons={[
        'Cancel',
        'Open',
      ]}
      onClick={this.onClick}
    />
  }
}

ConfirmPathDisruption.propTypes = {
  cancel: PropTypes.func,
  unconfirmedSearch: PropTypes.object,
}
