import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Select, { Value } from 'react-select'
import 'react-select/dist/react-select.css'
import { TagInput } from './elements'
import FilterPanel from '../FilterPanel'
import { clusterToPath } from 'utils/filter-tags'
import { ENTER, ARROW_UP, ARROW_DOWN } from 'utils/key-codes'
import { findTagFilterIndex, keyToTree } from 'utils/tags'

class TagSelector extends Component {
  static propTypes = {
    tags: PropTypes.array,
    tagTree: PropTypes.array,
    onChange: PropTypes.func,
    advanced: PropTypes.bool,
    error: PropTypes.string,
    arrowRenderer: PropTypes.func,
    placeholder: PropTypes.string,
  }
  state = {
    search: '',
    keyboardEvents: [],
  }
  prevOptions = null
  prevOptionInput = null
  pathToOption = (path) => {
    return {
      value: path,
      label: path[path.length - 1].title,
    }
  }
  getOptions = () => {
    return Object.values(clusterToPath).map(this.pathToOption)
  }
  getValue = (tags) => {
    // If the value changes, the input gets reset
    // This is a simple memoize implementation to avoid
    // unnecessarily changing the value
    if (tags !== this.prevOptionInput) {
      this.prevOptions = tags.map(this.pathToOption)
      this.prevOptionInput = tags
    }

    return this.prevOptions
  }

  inputHandler = (value) => {
    this.setState({
      search: value,
    })

    return value
  }
  valueComponent = (props) => {
    return <Value
      {...props}
      value={{ ...props.value }}
    />
  }
  onInputKeyDown = (event) => {
    switch (event.keyCode) {
      // falls through
      case ENTER:
      case ARROW_UP:
      case ARROW_DOWN:
        this.setState({
          keyboardEvents: [
            ...this.state.keyboardEvents,
            event.keyCode,
          ],
        })
        event.preventDefault()
        event.stopPropagation()
        break

      // no default
    }
  }
  addedTags = (newTags) => {
    const oldTags = this.props.tags

    return newTags.filter(tag => {
      return findTagFilterIndex(oldTags, tag, true) === -1
    })
  }
  menuRenderer = ({ selectValue }) => {
    const handleSelection = (tags) => {
      const added = this.addedTags(tags)

      if (added[0]) {
        // Make sure it is valid
        if (!this.props.advanced && keyToTree(added[0][added[0].length - 1]._key).children.length) {
          // Not in advanced mode, and there are subtags
          return
        }
        selectValue(this.pathToOption(added[0]))
      }
    }
    return (
      <div>
        <FilterPanel
          condensed
          advanced={this.props.advanced}
          tagFilters={this.props.tags}
          searchText={this.state.search}
          // Count needs to be at least one for checkboxes to be enabled
          getCount={() => 1}
          updateTagFilters={handleSelection}
          updateTypes={(checked, type) => checked && selectValue({ value: type, label: type.split('.')[2] })}
          keyboardEvents={this.state.keyboardEvents}
          tagTree={this.props.tagTree}
        />
      </div>
    )
  }

  render () {
    return (
      <TagInput error={this.props.error}>
        <Select
          multi
          placeholder={this.props.placeholder || 'Choose your tag(s)'}
          value={this.getValue(this.props.tags)}
          valueComponent={this.valueComponent}
          onChange={tags => this.props.onChange(tags.map(tag => tag.value))}
          clearable={false}
          // Required so "no results" text isn't shown when filtering
          options={this.getOptions()}
          menuRenderer={this.menuRenderer}
          onInputChange={this.inputHandler}
          onInputKeyDown={this.onInputKeyDown}
          arrowRenderer={this.props.arrowRenderer}
        />
      </TagInput>
    )
  }
}

export default TagSelector
