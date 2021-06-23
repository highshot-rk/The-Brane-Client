import PropTypes from 'prop-types'
import React from 'react'
import { VerbSelectorWrapper, VerbSelectorDrop, SearchWrapper } from './elements'
import { arrow as ShowMoreIcon } from './icons'
import DropDown from '../DropDown'
import MinimalSearch from '../MinimalSearch'
import SearchIcon from './search.svg'
import { getUpDownText, getLinkTypes } from 'utils/tags'

export default class VerbSelector extends React.Component {
  state = {
    searchValue: '',
    showMore: false,
  }
  dropDown = ({ options, selectOption }) => {
    const searching = this.state.searchValue.length > 0
    let visibleOptions = (this.state.showMore || searching) ? options : options.slice(0, 10)

    if (searching) {
      visibleOptions = visibleOptions.filter(({ text }) => {
        return text.indexOf(this.state.searchValue) > -1
      })
    }

    return (
      <VerbSelectorDrop direction={this.props.dropDirection}>
        <SearchWrapper>
          <img src={SearchIcon} alt='search' />
          <MinimalSearch
            value={this.state.searchValue}
            onChange={(e) => this.setState({ searchValue: e.target.value })}
            placeholder='Search link title'
            type='search'
            onClick={e => e.stopPropagation()} />
        </SearchWrapper>
        <ul>
          {visibleOptions.map((option) => {
            return (
              <li onClick={() => selectOption(options.indexOf(option))} key={option.value}>{option.text}</li>
            )
          })}
          {/* Temporarily disabled until we have the new predicate management */}
          {/* <li onClick={this.props.showCreateVerb}>
            <span className='icon'>+</span>
            CREATE LINK TITLE
          </li> */}
          {!searching && <li className={this.state.showMore ? 'reverse-icon' : ''} onClick={(e) => { e.stopPropagation(); this.setState({ showMore: ~this.state.showMore }) }}>
            {ShowMoreIcon}
            {this.state.showMore ? 'SHOW LESS' : 'SHOW MORE'}
          </li>}
        </ul>
      </VerbSelectorDrop>
    )
  }
  prepareOptions = () => {
    const {
      linkDirection,
    } = this.props

    return getLinkTypes().reduce((result, linkType, i) => {
      const text = getUpDownText(linkType)
      if (['all', 'parent'].includes(linkDirection)) {
        result.push({
          value: `${linkType}-parent`,
          text: text.up,
        })
      }
      if (['all', 'child'].includes(linkDirection)) {
        result.push({
          value: `${linkType}-child`,
          text: text.down,
        })
      }

      return result
    }, [])
  }
  onChange = (value) => {
    this.setState({
      searchValue: '',
      showMore: false,
    })
    this.props.onChange({
      type: value.split('-')[0],
      direction: value.split('-')[1],
    })
  }
  render () {
    const {
      selectedType,
      selectedDirection,
      minimal,
    } = this.props

    const options = this.prepareOptions()

    return (
      <VerbSelectorWrapper minimal={minimal}>
        <DropDown
          selected={`${selectedType}-${selectedDirection}`}
          label=''
          options={options}
          onChange={this.onChange}
          dropDown={this.dropDown}
        />
      </VerbSelectorWrapper>
    )
  }
}

VerbSelector.propTypes = {
  onChange: PropTypes.func,
  dropDirection: PropTypes.string,
  linkDirection: PropTypes.oneOf([
    // Show all
    'all',
    // Show down text
    'parent',
    // Show up text
    'child',
  ]),
  selectedType: PropTypes.string,
  selectedDirection: PropTypes.string,
  minimal: PropTypes.bool,
}
