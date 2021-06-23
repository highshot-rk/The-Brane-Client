import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Overlay from 'components/Overlay'
import Dialog from '../Dialog'
import { getData } from 'utils/injectData'
import Icon from 'components/Icon'
import { INITIAL_PATH_ID } from '../../constants'
import { createRelative } from 'utils/factories'
import { featureEnabled } from 'utils/features'
import { trackEvent } from 'utils/analytics'

const props = { width: 28, height: 28 }
const navigation = [
  { id: 'the-brane', icon: <Icon name='brane' dark {...props} /> },
  { id: 'search', icon: <Icon name='search' {...props} /> },
  { id: 'filter', icon: <Icon name='filter' {...props} /> },
  { id: 'properties', icon: <Icon name='property' {...props} /> },
  { id: 'add', position: 'bottom', icon: <Icon name='add' {...props} />, hidden: !featureEnabled('addLinkOrNode') },
  { id: 'expand', position: 'bottom', icon: <Icon name='arrow' width={16} height={16} direction='right' />, activeIcon: <Icon {...props} name='close' /> },
]

class Sidebar extends Component {
  static propTypes = {
    newSearchConfirm: PropTypes.func,
    showNodeCreationWindow: PropTypes.func,
    active: PropTypes.string,
    highlighted: PropTypes.string,
    open: PropTypes.func,
    close: PropTypes.func,
    onShowClearPathDialog: PropTypes.func,
    showClearPathDialog: PropTypes.bool,
    showOverlay: PropTypes.bool,
    lineagePaths: PropTypes.array,
    activePathIndex: PropTypes.number,
  }

  onClearPathClick = (button) => {
    switch (button) {
      case 'Cancel':
        return this.props.onShowClearPathDialog(false)
      case 'Clear':
        this.props.onShowClearPathDialog(false)
        return this.props.newSearchConfirm(
          { ...getData('root-node').rootNode,
            relatives: getData('root-node').links.map(link => createRelative(link._to, link)),
            type: 'root',
          })
       // no default
    }
  }

  handleClick = (menuItem) => {
    const {
      showNodeCreationWindow,
      active,
      open,
      close,
      lineagePaths,
      activePathIndex,
    } = this.props

    if (menuItem.id) {
      trackEvent('sidebarOpen', { menuItem: menuItem.id })
    }

    switch (menuItem.id) {
      case 'the-brane':
        if (activePathIndex !== INITIAL_PATH_ID || lineagePaths[activePathIndex].history.length > 1) {
          return this.props.onShowClearPathDialog(true)
        }
        break
      case 'add':
        return showNodeCreationWindow()
      default:
        if (active === menuItem.id) {
          return close()
        }
        return open(menuItem.id)
    }
  }

  render () {
    const firstOnBottom = navigation.indexOf(navigation.find(item => item.position === 'bottom' && !item.hidden))
    const { active, close, showOverlay, showClearPathDialog, highlighted } = this.props
    return (
      <div>
        {showClearPathDialog &&
        <Dialog
          text={`Clear current path? `}
          buttons={[
            'Cancel',
            'Clear',
          ]}
          onClick={this.onClearPathClick}
        />}
        {active && <Overlay transparent={!showOverlay} onClose={() => { close() }} />}
        <div className='sidebar'>
          <ul>
            {navigation.map((item, index) => {
              if (item.hidden) {
                return null
              }
              let className = (item.id === active || item.id === highlighted) ? 'active ' : ''

              if (index === firstOnBottom) {
                className += 'first-on-bottom '
              }

              return (
                <li
                  key={item.id}
                  className={className} >
                  <a onClick={() => this.handleClick(item)} >
                    {(item.id === active && item.activeIcon) ? item.activeIcon : item.icon}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    )
  }
}

export default Sidebar
