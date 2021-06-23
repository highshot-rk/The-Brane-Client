import React, { Component } from 'react'
import PropTypes from 'prop-types'
import cancelExpand from './icons/cancel-expand.svg'
import * as e from './elements'
import expandIcon from './icons/expand.svg'
import Metadata from './tabs/Metadata'
import Acknowledgement from './tabs/Acknowledgement'
import Citations from './tabs/Citations'

const AvailableTabs = {
  metadata: {
    name: 'Metadata',
    component: Metadata,
  },
  acknowledgement: {
    name: 'Acknowledgement',
    component: Acknowledgement,
  },
  citations: {
    name: 'Citations',
    component: Citations,
  },
}

class ThreeDotExpand extends Component {
  static propTypes = {
    item: PropTypes.object,
  }
  constructor () {
    super()
    this.state = { activeTab: null, expanded: false }
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded,
    })
  }

  tabsConfig = () => {
    const item = this.props.item

    switch (item._type) {
      case 'publication':
      case 'article':
      case 'journal':
        return [
          AvailableTabs.acknowledgement,
          AvailableTabs.metadata,
          AvailableTabs.citations,
        ]
      default:
        if (
          item.additionalProperties &&
          item.additionalProperties.metadata
        ) {
          return [
            AvailableTabs.metadata,
          ]
        }
        return false
    }
  }

  changeTab = (name) => {
    this.setState({ activeTab: name })
  }

  render () {
    const tabs = this.tabsConfig()

    if (!tabs) {
      return null
    }

    let activeTab = this.state.activeTab || tabs[0].name
    let TabContent = tabs.find(tab => tab.name === activeTab).component
    const { item } = this.props

    if (this.state.expanded) {
      return (
        <div className='node-preview-window__three-dots'>
          <hr />
          <img className='node-preview-window__icon-cancel-expand'
            src={cancelExpand}
            onClick={this.toggleExpanded}
            alt='Collapse'
          />
          <div className='node-preview-window__BottonWrapper'>
            <header>
              <ul>
                {tabs.map((tab) => {
                  return (
                    <li
                      key={tab.name}
                      className={(activeTab === tab.name)
                        ? 'active'
                        : null}>
                      <a onClick={() => this.changeTab(tab.name)}>
                        {tab.name}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </header>
            <TabContent item={item} />
          </div>
        </div>
      )
    } else {
      return (
        <e.Expand onClick={this.toggleExpanded}>
          <hr />
          <img src={expandIcon} alt='expand' />
        </e.Expand>
      )
    }
  }
}

export default ThreeDotExpand
