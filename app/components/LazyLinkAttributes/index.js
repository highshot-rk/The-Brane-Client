import React, { Component } from 'react'
import {
  getLinkById,
} from 'api/link'

export default function withLazyLinkAttributes (WrappedComponent) {
  return class LazyLinkAttributes extends Component {
    state = {
      attributes: {},
    }

    loadAttributes = (parentKey, linkKey) => {
      getLinkById(parentKey, linkKey)
        .then((link) => {
          this.setState({
            attributes: {
              ...this.state.attributes,
              [linkKey]: {
                description: link.description || '',
              },
            },
          })
        })
    }

    render () {
      return <WrappedComponent
        {...this.props}
        attributes={this.state.attributes}
        loadAttributes={this.loadAttributes}
      />
    }
  }
}
