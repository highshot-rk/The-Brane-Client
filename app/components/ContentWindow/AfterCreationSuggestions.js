import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Window } from 'elements/window'
import { SectionTitle, HiddenLink, LargeButton } from 'elements/form'
import { CreationSuggestionsWrapper } from './elements'

export default class AfterCreationSuggestions extends Component {
  render () {
    const {
      title,
      nodeId,
      parentTitle,
      parentId,
      onClose,
      showNodeCreationWindow,
    } = this.props

    return (
      <CreationSuggestionsWrapper>
        <Window
          width={'370px'}
          margin={'0 0 0 9px'}
        >
          <SectionTitle>Congratulations! {title} successfully created.</SectionTitle>
          <HiddenLink spacious onClick={() => showNodeCreationWindow(parentId)}>Create node from {parentTitle}</HiddenLink>
          <HiddenLink spacious onClick={() => showNodeCreationWindow(nodeId)}>Create node from {title}</HiddenLink>
          <HiddenLink spacious onClick={() => showNodeCreationWindow()}>Create node from a different node</HiddenLink>
          <LargeButton background={'#898C95'} onClick={onClose}>
            Close
          </LargeButton>
        </Window>
      </CreationSuggestionsWrapper>
    )
  }
}

AfterCreationSuggestions.propTypes = {
  title: PropTypes.string,
  nodeId: PropTypes.string,
  parentTitle: PropTypes.string,
  parentId: PropTypes.string,
  onClose: PropTypes.func,
  showNodeCreationWindow: PropTypes.func,
}
