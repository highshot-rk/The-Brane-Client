import React, { Component } from 'react'
import { Title, Lineage, Item, Time, Circle } from './elements'
import { Arrow } from './icons'
import { uniqueId } from 'lodash-es'
export default class Timeline extends Component {
  state = {
    collapsed: false,
  }
  render () {
    const {
      title,
      items,
      onSelect,
      expandedRenderer,
      onTitleSelect,
    } = this.props

    return (
      <div>
        <Title collapsed={this.state.collapsed}>
          <Arrow onClick={() => this.setState({ collapsed: !this.state.collapsed })} />
          <span onClick={onTitleSelect}>{title}</span>
        </Title>
        {!this.state.collapsed && <Lineage>
          {
            items.map(item =>
              <Item key={uniqueId('TimelineItem')} time={item.time} onClick={() => onSelect(item._id)}>
                {item.time ? <Time>{item.time}</Time> : <Circle active={item.active} />}
                {item.text}
                {item.expanded && expandedRenderer(item)}
              </Item>
            )
          }
        </Lineage>
        }
      </div>
    )
  }
}
