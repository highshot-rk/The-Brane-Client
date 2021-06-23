import PropTypes from 'prop-types'
import React from 'react'
import Autosuggest from 'react-autosuggest'

import { InputWrapper } from 'elements/form'
import {
  Suggestion, Clear, Wrapper,
} from './elements'
import { searchNodes } from 'api/node'
import {
  debounce,
} from 'lodash-es'
import {
  fuzzySearchNodes,
} from 'containers/Search/sagas'

export default class NodeInput extends React.Component {
  state = {
    suggestions: [],
  }

  _fetchSuggestions = debounce(async value => {
    this.setState({ isLoading: true })

    let { results } = await searchNodes(value)
    const filtered = results
      .filter(({ _key }) => !this.props.excludedKeys.includes(_key))
    results = fuzzySearchNodes(filtered, this.props.value)

    this.setState({
      isLoading: false,
      suggestions: results,
    })
  }, 200)

  _onSuggestionSelected = (e, { suggestion }) => this.props.onNodeSelected(suggestion)

  _getSuggestionValue = node => node.title

  _clearSuggestions = () => this.setState({ suggestions: [] })

  render () {
    const {
      selectedNode,
      errorText,
      onChange,
      value,
      placeholder,
      id,
      onClearSelected,
    } = this.props

    const inputProps = {
      placeholder: placeholder,
      value: value,
      onChange: (event, { newValue }) => onChange(newValue),
    }
    return (
      <Wrapper>
        <Autosuggest
          id={id}
          suggestions={this.state.suggestions}
          onSuggestionsFetchRequested={({ value }) => this._fetchSuggestions(value)}
          onSuggestionsClearRequested={this._clearSuggestions}
          onSuggestionSelected={this._onSuggestionSelected}
          getSuggestionValue={this._getSuggestionValue}
          renderSuggestion={item => <Suggestion>{item.title}</Suggestion>}
          inputProps={inputProps}
          renderInputComponent={props => <InputWrapper error={errorText} ><input {...props} /></InputWrapper>}
          focusInputOnSuggestionClick={false}
        />
        { selectedNode && <Clear onClick={onClearSelected}>&times;</Clear> }
      </Wrapper>
    )
  }
}

NodeInput.propTypes = {
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  value: PropTypes.string,
  id: PropTypes.string,
  onNodeSelected: PropTypes.func,
  onClearSelected: PropTypes.func,
  selectedNode: PropTypes.object,
  errorText: PropTypes.string,
  excludedKeys: PropTypes.array,
}

NodeInput.defaultProps = {
  excludedKeys: [],
}
