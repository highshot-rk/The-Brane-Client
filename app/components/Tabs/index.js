import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Tab, TabWrapper } from './elements'

export default class Tabs extends Component {
  state = {

  }

  render () {
    const {
      activeTab,
      tabs,
      onSelectTab,
    } = this.props

    return (
      <TabWrapper>
        {
          tabs.map(name =>
            <Tab onClick={() => onSelectTab(name)} key={name} selected={activeTab === name}>{name}</Tab>
          )
        }
      </TabWrapper>
    )
  }
}

Tabs.propTypes = {
  activeTab: PropTypes.string,
  tabs: PropTypes.array,
  onSelectTab: PropTypes.func,
}
