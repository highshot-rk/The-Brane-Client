import React from 'react'
import { Search, SearchWrapper } from './elements'
import FixedPathInstructions from '../FixedPathInstructions'
import searchIcon from './search.svg'
import PropTypes from 'prop-types'

export default class CenterSearch extends React.Component {
  static propTypes = {
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    query: PropTypes.string,
  }
  render () {
    return (
      <SearchWrapper>
        <FixedPathInstructions />
        <Search>
          <img src={searchIcon} alt='search' />
          <input type='search'
            onBlur={this.props.onBlur}
            onFocus={this.props.onFocus}
            ref={(input) => { this.search = input }}
            onChange={this.props.onChange}
            value={this.props.query}
            placeholder='Search' />
        </Search>
      </SearchWrapper>
    )
  }
  componentDidMount () {
    this.search.focus()
  }
}
