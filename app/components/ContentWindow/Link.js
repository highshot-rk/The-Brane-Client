import React, { Component } from 'react'
import PropTypes from 'prop-types'
import explore from './icons/read.png'
import {
  LinkDetail,
  EditPost,
} from './elements'
import { featureEnabled } from 'utils/features'
import { getUpDownText } from 'utils/tags'
import Icon from 'components/Icon'

export default class Link extends Component {
  static propTypes = {
    link: PropTypes.object,
    nodeTitle: PropTypes.string,
    expanded: PropTypes.bool,
    linkAttributes: PropTypes.object,
    toggleLinkSidebar: PropTypes.func,
    showPreviewWindow: PropTypes.func,
    toggleExpanded: PropTypes.func,
    onExplore: PropTypes.func,
  }
  render () {
    const {
      link: relative,
      nodeTitle,
      expanded,
      linkAttributes,
      toggleLinkSidebar,
      showPreviewWindow,
      toggleExpanded,
      onExplore,
    } = this.props
    const upDownText = getUpDownText(relative.linkType, relative.linkName)
    let actionText

    if (relative.linkDirection === 'parent') {
      actionText = upDownText.up
    } else {
      actionText = upDownText.down
    }

    return (
      <li>
        <div className='header'>
          <div className='info' onClick={toggleExpanded}>
            <Icon name='link-straight' width={20} height={20} alt='Link' />
            <h5>
              <a onClick={toggleLinkSidebar} >{nodeTitle}</a>
              {` ${actionText} `}
              <a onClick={showPreviewWindow} >{relative.title}</a>
            </h5>
          </div>
          { featureEnabled('linkContentWindow') &&
          <img src={explore} alt='explore' onClick={onExplore} className='explore' height='21' />
          }
        </div>
        <LinkDetail display={expanded}>
          <EditPost style={{ padding: '10px 15px' }}>
            <section>
              { !linkAttributes
                ? <h4>Loading...</h4>
                : <React.Fragment>
                  <h4>Definition</h4>
                  <p>
                    {linkAttributes.description || 'No description'}
                  </p>
                  { linkAttributes.references && (<>
                    <h4>References</h4>
                    <p>{linkAttributes.references}</p>
                    </>)
                  }
                </React.Fragment>
              }
            </section>
          </EditPost>
        </LinkDetail>
      </li>
    )
  }
}
