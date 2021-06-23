import React, { Component } from 'react'
import { LinkRow, Expand } from './elements'
import VerbSelector from '../VerbSelector'
import arrowIcon from './arrow.svg'
import { featureEnabled } from 'utils/features'

export default class Link extends Component {
  render () {
    const {
      index,
      link,
      selected,
      onLinkChecked,
      onLinkVerbChanged,
      nodeTitle,
      showCreateVerb,
      expanded,
      toggleExpand,
    } = this.props

    return (
      <LinkRow>
        <td><input checked={selected} type='checkbox' onChange={() => onLinkChecked(index)} /></td>
        <td className='targetTitle'>{link.text}</td>
        <td>
          <VerbSelector
            minimal
            selectedType={link.type}
            dropDirection='up'
            linkDirection={link.isParent ? 'parent' : 'child'}
            selectedDirection={link.isParent ? 'parent' : 'child'}
            onChange={linkIndex => onLinkVerbChanged(index, linkIndex)}
            showCreateVerb={showCreateVerb}
          />
        </td>
        <td className='nodeTitle'>{nodeTitle}</td>
        <td>
          { featureEnabled('linkContentWindow')
            ? <Expand onClick={() => toggleExpand(index, !expanded)} src={arrowIcon} expanded={expanded} />
            : null
          }
        </td>
        <td className='views'>
          { featureEnabled('linkViewCount')
            ? '150 views'
            : null
          }
        </td>
      </LinkRow>
    )
  }
}
