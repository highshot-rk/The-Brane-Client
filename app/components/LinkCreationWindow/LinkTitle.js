import PropTypes from 'prop-types'
import React from 'react'
import {
  LinkTitleWrapper,
  VerbSelectorWrapper,
} from './elements'
import NodeInput from '../NodeInput'
import VerbSelector from '../VerbSelector'

function TitleInput ({
  index,
  link,
  onLinkTargetChanged,
  onLinkTextChanged,
}) {
  return <NodeInput
    id={`link-target-${index}`}
    value={link.text}
    onChange={value => onLinkTextChanged(index, value)}
    placeholder='Enter a node'
    selectedNode={link.topic}
    onClearSelected={() => { onLinkTargetChanged(index, null) }}
    onNodeSelected={node => onLinkTargetChanged(index, node)}
  />
}

export default function LinkTitle ({
  links,
  linkDirection,
  linkType,
  onLinkTypeChanged,
  onLinkTextChanged,
  onLinkTargetChanged,
}) {
  return (
    <LinkTitleWrapper>
      <TitleInput
        index={0}
        link={links[0]}
        onLinkTextChanged={onLinkTextChanged}
        onLinkTargetChanged={onLinkTargetChanged}
      />
      <VerbSelectorWrapper>
        <VerbSelector
          selectedType={linkType}
          selectedDirection={linkDirection}
          linkDirection={'all'}
          onChange={onLinkTypeChanged}
        />
      </VerbSelectorWrapper>
      <TitleInput
        index={1}
        link={links[1]}
        onLinkTextChanged={onLinkTextChanged}
        onLinkTargetChanged={onLinkTargetChanged}
      />
    </LinkTitleWrapper>
  )
}

LinkTitleWrapper.propTypes = {
  links: PropTypes.array,
  verbs: PropTypes.array,
  onLinkTypeChanged: PropTypes.func,
  onLinkTextChanged: PropTypes.func,
  onLinkTargetChanged: PropTypes.func,
  showCreateVerb: PropTypes.func,
}
