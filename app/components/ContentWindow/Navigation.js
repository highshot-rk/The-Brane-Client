import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { LinkNavHeader } from './elements'
import { ArrowIcon } from '../NavigationBottomBar/icons'
import { truncateString } from '../../utils/strings'

export default class Navigation extends Component {
  static propTypes = {
    lpwBack: PropTypes.func,
    lpwForward: PropTypes.func,
    hideWindow: PropTypes.func,
    nextNode: PropTypes.object,
    prevNode: PropTypes.object,
  }

  render () {
    const {
      nextNode,
      prevNode,
      lpwBack,
      lpwForward,
      hideWindow,
    } = this.props

    return (
      <>
        {(nextNode || prevNode) && <LinkNavHeader>
          {prevNode && <div><img alt='back' src={ArrowIcon} /> <button type='button' onClick={lpwBack}>
            {prevNode.title ? `Back to ${truncateString(prevNode.title, 10)}` : 'Back'}
          </button></div>}
          {nextNode && <div className='n-forward' ><button type='button' onClick={lpwForward}>
            {nextNode.title ? `Forward to ${truncateString(nextNode.title, 10)}` : 'Forward'}
          </button><img alt='forward' src={ArrowIcon} style={{ transform: 'rotate(180deg)' }} /></div>}
        </LinkNavHeader>
        }

        <div className='node-preview-window__mobile-menu'>
          <button type='button' onClick={hideWindow}>
            Back
          </button>
        </div>
      </>
    )
  }
}
