import PropTypes from 'prop-types'
import React, { Component } from 'react'
import linkIcon from './link.svg'
import {
  LinkListHeader,
  LinkListContent,
  LinkListItem,
  LinkListSeparator,
} from './elements'

export default class LinkList extends Component {
  static propTypes = {
    nodeTitle: PropTypes.string,
    links: PropTypes.array,
  }
  render () {
    return (
      <div>
        <LinkListHeader>{this.props.nodeTitle}</LinkListHeader>
        <LinkListContent>
          {this.props.links.map((link, index) => (
            <LinkListItem key={link.node._id}>
              {index !== 0 && <LinkListSeparator />}
              <img src={linkIcon} alt='Link' />
              is related to {link.node.title}
            </LinkListItem>
          ))}
        </LinkListContent>
      </div>
    )
  }
}
