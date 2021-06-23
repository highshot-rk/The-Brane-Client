import { collapse, expand, lock, lockWhite, exploreIcon, readIcon } from './icons'

import PropTypes from 'prop-types'

import React from 'react'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'

import { ENTER, ESCAPE, ARROW_UP, ARROW_DOWN } from '../../utils/key-codes'
import { C02_LIGHT, C01_LIGHT, THEME_DEFAULT, C02_DARKEST } from 'styles/colors'
import { NodeMenu, NodeItem } from './elements'
import { BRANE_NODE_ID, VENN_ID } from '../../constants'

export default class Menu extends React.Component {
  static propTypes = {
    node: PropTypes.object,
    parentNode: PropTypes.object,
    focusedNodeId: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
    isChild: PropTypes.bool,
    exploreNode: PropTypes.func,
    hideMenu: PropTypes.func,
    showLinkPreview: PropTypes.func,
    showNodePreview: PropTypes.func,
    collapseBranch: PropTypes.func,
    expandBranch: PropTypes.func,
    toggleOrbitLock: PropTypes.func,
    orbitLocked: PropTypes.bool,
    isCollapsed: PropTypes.bool,
    overflow: PropTypes.string,
    isFirst: PropTypes.bool,
    overlayOpen: PropTypes.bool,
    onFocusedChild: PropTypes.func,
    confirmRestorePath: PropTypes.bool,
  }

  state = {
    menuOptions: [],
  }

  initMenuOptions = () => {
    this.setState({
      menuOptions: [
        { name: 'explore', focused: false },
        { name: 'read', focused: true },
        { name: 'lockOrbit', focused: false },
        { name: 'collapse', focused: false },
        { name: 'restore', focused: false },
        { name: 'backHome', focused: false },
      ],
    })
  }

  get isParent () {
    return !(this.props.node._id !== this.props.focusedNodeId || this.props.isChild)
  }

  explore = () => {
    this.props.exploreNode(
      this.props.node._id,
      this.props.node.title,
      this.props.parentNode._id,
      this.props.node.angle,
    )
    this.props.hideMenu()
  }

  showPreview = () => {
    const linkMenu = typeof this.props.node === 'string'
    if (linkMenu) {
      this.props.showLinkPreview(this.props.parentNode._id, this.props.node)
    } else {
      this.props.showNodePreview(this.props.node._id)
    }
    this.props.hideMenu()
  }

  generateMenu = (items) => {
    return this.state.menuOptions.filter(item => items.includes(item.name))
  }

  getVisibleMenuItems = () => {
    let menuOptions = [...this.state.menuOptions]
    if (this.props.parentNode.isUserNode) {
      menuOptions = this.generateMenu(['read', 'backHome', 'lockOrbit'])
    } else if (this.props.isChild && !this.props.isCollapsed) {
      menuOptions = this.generateMenu(['explore', 'read'])
    } else if (this.props.isChild && this.props.isCollapsed) {
      menuOptions = this.generateMenu(['restore', 'read'])
    } else if (this.isParent && (this.props.isFirst)) {
      menuOptions = this.generateMenu(['read', 'lockOrbit'])
    } else {
      menuOptions = this.generateMenu(['read', 'collapse', 'lockOrbit'])
    }
    return menuOptions
  }

  focusNextOption = () => {
    let menuOptions = this.getVisibleMenuItems()
    const currentIndex = menuOptions.findIndex(item => item.focused)
    menuOptions = menuOptions.map(item => ({ ...item, focused: false }))
    let index = 0
    if (currentIndex !== -1 && currentIndex < menuOptions.length - 1) {
      index = currentIndex + 1
    } else {
      index = 0
    }
    menuOptions[index].focused = true
    this.setState({ menuOptions })
  }

  focusPreviusOption = () => {
    let menuOptions = this.getVisibleMenuItems()
    const currentIndex = menuOptions.findIndex(item => item.focused)
    menuOptions = menuOptions.map(item => ({ ...item, focused: false }))
    let index = 0
    if (currentIndex !== -1 && currentIndex > 0 && currentIndex <= menuOptions.length - 1) {
      index = currentIndex - 1
    } else {
      index = menuOptions.length - 1
    }
    menuOptions[index].focused = true
    this.setState({ menuOptions })
  }

  getFillColor = itemName => {
    let focusedColor = THEME_DEFAULT
    const menuItem = this.state.menuOptions.find(item => item.name === itemName)

    if (menuItem && menuItem.focused) {
      return focusedColor
    } else {
      return C02_DARKEST
    }
  }

  onMenuItemHover = menuItem => {
    let menuOptions = this.getVisibleMenuItems()
    const currentIndex = menuOptions.findIndex(item => item.name === menuItem.name)
    if (!menuOptions[currentIndex].focused) {
      menuOptions = menuOptions.map(item => ({ ...item, focused: false }))
      menuOptions[currentIndex].focused = true
      this.setState({ menuOptions })
    }
  }

  render () {
    let offset = 60
    const radius = 30

    if (!this.props.isChild) {
      offset = this.props.node.angle + 40
    }
    let y = offset
    let x = this.props.x < 0 ? Math.abs(offset) : -1 * Math.abs(offset)

    if (!this.props.isChild && this.props.parentNode._id === VENN_ID) {
      x *= 1.35
    }

    let positionScale = 1
    if (this.props.isChild && this.props.parentNode._id !== this.props.focusedNodeId) {
      positionScale = 0.8
    }

    const exploreX = this.props.overflow === 'top' ? -1 * y - 20 : 0
    const exploreY = this.props.overflow === 'top' ? y : -1 * y

    let menuOptions = [
      {
        name: 'explore',
        onClick: this.explore,
        transform: `translate(${exploreX}, ${exploreY})`,
        fill: this.getFillColor('explore'),
        icon: exploreIcon,
      },
      {
        name: 'read',
        onClick: this.showPreview,
        transform: `translate(${x}, 0)`,
        fill: this.getFillColor('read'),
        icon: readIcon,
      },
      {
        name: 'lockOrbit',
        onClick: this.props.toggleOrbitLock.bind(null, this.props.node._id),
        transform: `translate(${-1 * x}, 0)`,
        fill: this.props.orbitLocked ? C02_LIGHT : this.getFillColor('lockOrbit'),
        icon: this.props.orbitLocked ? lockWhite : lock,
      },
      {
        name: 'collapse',
        onClick: this.props.collapseBranch.bind(null, this.props.node._id, this.props.node.originallyFrom),
        transform: `translate(0, ${-1 * y})`,
        fill: this.getFillColor('collapse'),
        icon: collapse,
      },
      {
        name: 'restore',
        onClick: this.props.expandBranch.bind(null, this.props.node._id),
        transform: `translate(0, ${-1 * y})`,
        fill: this.getFillColor('restore'),
        icon: expand,
      },
      {
        name: 'backHome',
        onClick: () => this.props.confirmRestorePath(0, BRANE_NODE_ID),
        transform: `translate(0, ${-1 * y})`,
        fill: this.getFillColor('backHome'),
        icon: collapse,
      },
    ]
    // Render only the visible node menu items
    menuOptions = menuOptions
      .filter(item => this.getVisibleMenuItems()
        .map(visibleItem => visibleItem.name)
        .includes(item.name))

    return (
      <ReactCSSTransitionGroup
        transitionName='node-menu-animation'
        transitionAppear
        transitionAppearTimeout={300}
        component='g'
        transitionEnter={false}
        transitionLeaveTimeout={300}>
        <NodeMenu
          transform={`translate(${this.props.x * positionScale}, ${this.props.y * positionScale})`}
        >
          {menuOptions.map(menuItem => (
            // Do not show collapseBranch icon for "The Brane" node or first node shown after searching
            !(menuItem.name === 'collapse' && this.props.isFirst) &&
            <NodeItem
              onMouseOver={() => this.onMenuItemHover(menuItem)}
              key={menuItem.name}
              itemName={menuItem.name}
              orbitLocked={this.props.orbitLocked}
              transform={menuItem.transform}
              fillIcon={menuItem.fill}
              onClick={menuItem.onClick}>
              <circle r={radius} fill={C01_LIGHT} />
              {menuItem.icon}
            </NodeItem>
          ))}
        </NodeMenu>
      </ReactCSSTransitionGroup>
    )
  }

  documentKeyHandler = (event) => {
    if (this.props.overlayOpen) {
      return
    }
    switch (event.keyCode) {
      case ENTER:
        const focusedItem = this.state.menuOptions.find(item => item.focused)
        this.props.onFocusedChild(null)
        if (focusedItem) {
          switch (focusedItem.name) {
            case 'explore':
              return this.explore()
            case 'lockOrbit':
              return this.props.toggleOrbitLock(this.props.node._id)
            case 'collapse':
              return this.props.collapseBranch(this.props.node._id, this.props.node.originallyFrom)
            case 'restore':
              return this.props.expandBranch(this.props.node._id)
            case 'read':
              return this.showPreview()
            // no default
          }
        }
        break
      case ESCAPE:
        return this.props.hideMenu()
      case ARROW_UP:
        return this.focusNextOption()
      case ARROW_DOWN:
        return this.focusPreviusOption()
      // no default
    }
  }

  componentWillMount () {
    document.addEventListener('keydown', this.documentKeyHandler)
    this.initMenuOptions()
  }

  componentWillUnmount () {
    document.removeEventListener('keydown', this.documentKeyHandler)
  }
}
