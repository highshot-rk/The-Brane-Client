import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { TabTextContent } from '../elements'

export default class Citations extends Component {
    static propTypes = {
      item: PropTypes.shape({
        additionalProperties: PropTypes.shape({
          citedReferences: PropTypes.string,
        }),
      }),
    }

    render () {
      let citations = this.props.item.additionalProperties.citedReferences || []

      return (
        <TabTextContent>
          {citations.length === 0 && <p>Has no citations</p>}
          {citations.length > 0 && citations.map(citation => {
            const parts = citation.split(',')
            return <p>
              <strong>{parts.shift()},</strong>
              {parts.join(',')}
            </p>
          })}
        </TabTextContent>
      )
    }
}
