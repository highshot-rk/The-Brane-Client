import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { MetadataTable } from '../elements'

const metadataProperties = {
  journal: 'Journal',
  'ISSN': 'ISSN',
  electronicISSN: 'Electronic ISSN',
  'ISBN': 'ISBN',
  'monthPublished': 'Month published',
  'yearPublished': 'Year published',
  volume: 'Volume',
  'issue': 'Issue',
  part: 'Part',
  beginningPage: 'Beginning page',
  enginePage: 'Ending page',
  articleID: 'ArticleID',
  doi: 'DOI',
  woSID: 'WoSID',
  pubMedId: 'PubMedID',
  dateDownloaded: 'Date downloaded',
  grants: 'Grants',
  sources: 'Sources',
}

export default class Metadata extends Component {
  static propTypes = {
    item: PropTypes.shape({
      additionalProperties: PropTypes.object,
    }),
  }

  hasValue = (value) => {
    if (Array.isArray(value)) {
      return value.length > 0
    }

    return !!value
  }
  render () {
    const {
      item,
    } = this.props

    // Some top-level topic properties are treated as metadata
    // which on the client are stored in additionalProperties
    // All other metadata is stored in a "metadata" property,
    // which the client moves to additionalProperties.metadata.
    const topicMetadata = item.additionalProperties.metadata || {}
    const entries = [
      ...Object.entries(metadataProperties),
      ...Object.keys(topicMetadata).map(key => {
        // We expect the key to be the same as the title
        return [key, key]
      }),
    ]

    return (
      <MetadataTable>
        <tbody>
          {entries.map(([prop, title]) => {
            const value = item.additionalProperties[prop] || topicMetadata[prop]

            if (this.hasValue(value)) {
              return <tr key={title} >
                <td>{title}:</td>
                <td>{value}</td>
              </tr>
            }

            return null
          })}
        </tbody>
      </MetadataTable>
    )
  }
}
