import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Accordion from 'components/Accordion'
import { SearchResults, Result } from './elements'

export default class TopResults extends Component {
  static propTypes = {
    results: PropTypes.array,
    selected: PropTypes.string,
    onClick: PropTypes.func,
    showCount: PropTypes.bool,
  }
  static defaultProps = {
    showCount: true,
  }

  state = {
    closedFamilies: [],
  }

  toggleOpen = (name) => {
    const closed = this.state.closedFamilies.slice()

    if (closed.includes(name)) {
      closed.splice(closed.indexOf(name), 1)
    } else {
      closed.push(name)
    }

    this.setState({
      closedFamilies: closed,
    })
  }
  handleClick = (result) => {
    const index = this.props.results.indexOf(result)

    this.props.onClick(index, result)
  }
  render () {
    return (
      <SearchResults>
        {
          this.props.results.map((family, index) => (
            <Accordion
              key={family}
              title={family.name}
              name={family.name}
              smallTitle={`(${family.count})`}
              open={!this.state.closedFamilies.includes(family.name)}
              toggleOpen={this.toggleOpen}
              showCheckbox={false}
              subAccordion
              noOffset
            >
              {
                family.results.map((result, resultIndex) => (
                  <Result
                    key={result._id}
                    condensed
                    onClick={() => this.handleClick(result)}
                    selected={
                      this.props.selected === result._id ||
                  (index === 0 && resultIndex === 0 && this.props.selected === '')}
                  >
                    <span>{result.title}</span>
                    { this.props.showCount && result.childCount > 0 && <span className='count'>{result.childCount}</span> }
                  </Result>
                ))
              }
            </Accordion>
          ))
        }
        { this.props.children }
      </SearchResults>
    )
  }
}

TopResults.propTypes = {
  results: PropTypes.array,
}
