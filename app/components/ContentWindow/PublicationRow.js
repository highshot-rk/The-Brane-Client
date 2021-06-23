import React from 'react'
import openAccess from './icons/open.png'
import { Publication } from './elements'
import PropTypes from 'prop-types'

const MAX_CHARACTER_ABSTRACT = 300
class PublicationRow extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    author: PropTypes.array,
    date: PropTypes.string,
    doi: PropTypes.string,
    abstract: PropTypes.string,
    url: PropTypes.string,
  }
  state = { abstract: '', showMore: false }

  componentDidMount () {
    this.setState({
      abstract: this.props.abstract.substring(0, MAX_CHARACTER_ABSTRACT),
    })
  }

  toggleShowMore = () => {
    this.setState({
      abstract: !this.state.showMore ? this.props.abstract
        : this.props.abstract.substring(0, MAX_CHARACTER_ABSTRACT),
      showMore: !this.state.showMore,
    })
  }

  render () {
    const { title, author, date, doi, abstract, url } = this.props
    return (
      <Publication>
        <section>
          <a href={url} target='_blank'>{title} <img src={openAccess} alt='openAccess' /></a>
          <p>Titled by {author.map(author => <strong key={author}>{`${author}, `}{date}</strong>)}</p>
          <p>DOI: {doi}</p>
          <p>{this.state.abstract}
            {abstract.length > MAX_CHARACTER_ABSTRACT && !this.state.showMore && <button onClick={this.toggleShowMore}>[…]</button>}
          </p>
        </section>
      </Publication>
    )
  }
}

export default PublicationRow
