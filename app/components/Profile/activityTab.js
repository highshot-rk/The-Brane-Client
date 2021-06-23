import React, { Component } from 'react'
import Timeline from '../Timeline'
import { formatDateTitle, formatTime } from 'utils/dates'

export default class ActivityTab extends Component {
  state = {
    activities: [],
    // TODO: get activities from server
    // activities: [{
    //   date: new Date(),
    //   items: [{
    //     time: new Date(Date.now() - 10000),
    //     action: 'merge',
    //     props: [ 'Nanotechnology', 'Nanotech' ]
    //   }, {
    //     time: new Date(Date.now() - 10000),
    //     action: 'merge',
    //     props: [ 'Nanotechnology', 'Nanotech' ]
    //   }, {
    //     time: new Date(Date.now() - 10000),
    //     action: 'merge',
    //     props: [ 'Nanotechnology', 'Nanotech' ]
    //   }]
    // }, {
    //   date: new Date(Date.now() - 100000),
    //   items: [{
    //     time: new Date(Date.now() - 10000),
    //     action: 'merge',
    //     props: [ 'Nanotechnology', 'Nanotech' ]
    //   }, {
    //     time: new Date(Date.now() - 10000),
    //     action: 'merge',
    //     props: [ 'Nanotechnology', 'Nanotech' ]
    //   }, {
    //     time: new Date(Date.now() - 10000),
    //     action: 'merge',
    //     props: [ 'Nanotechnology', 'Nanotech' ]
    //   }]
    // }]
  }
  createItemText = item => {
    switch (item.action) {
      case 'merge':
        return <p>
          merged <strong>{item.props[0]} </strong>
          and <strong>{item.props[1]}</strong></p>
    }
  }
  createItems = (items) => {
    return items.map(item => {
      return {
        ...item,
        time: formatTime(item.time),
        text: this.createItemText(item),
      }
    })
  }
  render () {
    return (
      <div>
        {this.state.activities.length > 0 ? this.state.activities.map(activity =>
          <Timeline
            title={formatDateTitle(activity.date)}
            items={this.createItems(activity.items)}
          />
        ) : <p>No activity yet</p>}
      </div>
    )
  }
}
