import React from 'react'
import { Remove, LinkRow } from './elements'
import NodeInput from '../NodeInput'
import {
  SectionTitle,
  AddRowButton,
} from 'elements/form'
import VerbSelector from '../VerbSelector'
import LinkDirectionToggle from './LinkDirectionToggle'

class Link extends React.Component {
  render () {
    const {
      index,
      link,
      onLinkTextChanged,
      onLinkTargetChanged,
      onLinkTypeChanged,
      onLinkToggleIsParent,
      onRemove,
      nodeTitle,
      // showCreateVerb,
      canDelete,
      verbSelectorDirection,
    } = this.props

    return (
      <LinkRow>
        <NodeInput
          id={`link-target-${index}`}
          value={link.text}
          selectedNode={link.node}
          onClearSelected={() => { onLinkTargetChanged(index, null); onLinkTextChanged(index, '') }}
          onChange={value => onLinkTextChanged(index, value)}
          placeholder='Enter a node'
          onNodeSelected={node => onLinkTargetChanged(index, node)}
        />
        <VerbSelector
          selectedType={link.type}
          selectedDirection={link.isParent ? 'parent' : 'child'}
          linkDirection={link.isParent ? 'parent' : 'child'}
          onChange={({ type }) => onLinkTypeChanged(index, type)}
          dropDirection={verbSelectorDirection}
        />
        <span className='nodeTitle'>{nodeTitle}</span>
        <LinkDirectionToggle isParent={link.isParent} onDirectionChange={isParent => onLinkToggleIsParent(index, isParent)} />
        {canDelete && <Remove onClick={() => onRemove(index)}>&times;</Remove>}
      </LinkRow>
    )
  }
}

export const Lineage = ({
  title,
  onLinkTypeChanged,
  onLinkTextChanged,
  onLinkTargetChanged,
  onLinkToggleIsParent,
  onRemoveLink,
  addLink,
  parentsError,
  parentsErrorText,
  links,
  showCreateVerb,
  multi,
  verbSelectorDirection = 'up',
}) => {
  return (
    <div>
      {multi && <SectionTitle>Links</SectionTitle>}
      {links.map((link, index) =>
        <Link
          key={index}
          index={index}
          link={link}
          onLinkTextChanged={onLinkTextChanged}
          onLinkTargetChanged={onLinkTargetChanged}
          onLinkTypeChanged={onLinkTypeChanged}
          onLinkToggleIsParent={onLinkToggleIsParent}
          onRemove={onRemoveLink}
          nodeTitle={title}
          showCreateVerb={showCreateVerb}
          canDelete={multi}
          verbSelectorDirection={verbSelectorDirection}
        />
      )}
      {multi &&
      <AddRowButton onClick={addLink}>
        <button>+</button>
        <span>Add Link</span>
      </AddRowButton>
      }
    </div>
  )
}

export default Lineage
