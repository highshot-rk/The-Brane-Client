import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Separator,
  CreationSuggestions,
  Create,
} from './elements'
import createIcon from './icons/create.svg'
import { featureEnabled } from 'utils/features'

export default class NoResults extends Component {
  static propTypes = {
    query: PropTypes.string,
    createNode: PropTypes.func,
    someResults: PropTypes.bool,
  }

  render () {
    const {
      query,
      createNode,
      someResults,
    } = this.props

    if (!featureEnabled('addLinkOrNode')) {
      if (someResults) {
        return null
      }

      return (<CreationSuggestions>
        <p>No results were found</p>
      </CreationSuggestions>
      )
    }

    return (
      <>
        {someResults && <Separator />}
        <CreationSuggestions someResults={someResults}>
          <p>{ someResults
            ? 'Didn\'t find what you were looking for?'
            : `${query} doesn't exist yet...` }</p>
          <p>Be the first to add <b>{query}</b> to The Brane</p>
        </CreationSuggestions>
        <Separator />
        <Create onClick={() => createNode(query)}>
          <img src={createIcon} alt='' /> CREATE NODE
        </Create>
      </>
    )
  }
}
