import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { SearchContainer } from './elements'
import { textWidth } from 'utils/dom'

export default class SearchInput extends Component {
  static propTypes = {
    name: PropTypes.number,
    vennDiagram: PropTypes.bool,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.string,
    onKeyDown: PropTypes.func,
    onLockClicked: PropTypes.func,
    locked: PropTypes.bool,
    bothLocked: PropTypes.bool,
    inputRef: PropTypes.func,
  }

  focused = () => {
    this.props.onFocus(this.props.name)
  }
  lockedClicked = () => {
    this.props.onLockClicked(this.props.name)
  }
  inputRef = (e) => {
    this.props.inputRef(e, this.props.name)
  }
  onChange = (e) => {
    this.props.onChange(e, this.props.name)
  }
  getWidth = () => {
    if (!this.props.vennDiagram || this.props.name > 0 || this.props.locked) {
      return '100%'
    }

    const width = textWidth(this.props.value, {
      fontSize: '12px',
      fontFamily: 'HKGrotesk',
    }) + 30

    if (width < 50) {
      return '50px'
    }

    if (width > 150) {
      return '150px'
    }

    return `${width}px`
  }

  truncateLockedTitle () {
    const {
      value,
    } = this.props

    if (value.length > 33) {
      return `${value.slice(0, 30)}...`
    }

    return value
  }

  render () {
    const {
      locked,
      bothLocked,
      vennDiagram,
      value,
      onKeyDown,
      name,
    } = this.props

    return (
      <SearchContainer
        locked={locked}
        bothLocked={bothLocked}
        width={this.getWidth()}
        vennDiagram={vennDiagram}
      >
        <input
          onFocus={this.focused}
          onChange={this.onChange}
          value={value}
          onKeyDown={onKeyDown}
          ref={this.inputRef}
          autoFocus
          type='search'
          placeholder={name === 0 ? 'Search' : ''}
        />
        <div onClick={this.lockedClicked} title={this.truncateLockedTitle() !== value ? value : null} className='locked'>
          {this.truncateLockedTitle()}
        </div>
      </SearchContainer>
    )
  }
}
