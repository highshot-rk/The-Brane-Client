import React, { Component } from 'react'
import { PublicationDetails, Publication, PublicationWrapper, AddPublicationButton } from './elements'
import { getUserPublications } from 'api/profile'

export default class Publications extends Component {
  constructor () {
    super()
    this.state = {
      publications: null,
      expandedPublication: null,
    }
  }
  getPublications = () => {
    getUserPublications(this.props.userId).then(response => {
      if (response.status === 200) {
        this.setState({
          publications: response.data,
        })
      }
    })
  }
  componentDidMount () {
    this.getPublications()
  }
  render () {
    if (this.state.publications === null) {
      return <p>Loading...</p>
    } else if (this.state.publications.length === 0) {
      return <div>
        <AddPublicationButton condensed onClick={this.props.toggleNewPublication}>
          <button>+</button>
          <span>Add Publication</span>
        </AddPublicationButton>
        <p>No publications.</p>
      </div>
    }

    return (
      <PublicationWrapper>
        <AddPublicationButton condensed onClick={this.props.toggleNewPublication}>
          <button>+</button>
          <span>Add Publication</span>
        </AddPublicationButton>
        {this.state.publications.map(publication =>
          <Publication key={publication._id}>
            <h3>{publication.title}</h3>
            <PublicationDetails>
              Published by {
                publication.authors.map(author => <strong key={author._id}>{`${author.fn} ${author.ln} `}</strong>)
              }
              in {
                publication.nodes.map(node => <strong key={node._id}>{`${node.t} `}</strong>)
              }
            </PublicationDetails>
            <p>{publication.DOI}</p>
          </Publication>
        )}
      </PublicationWrapper>
    )
  }
}
