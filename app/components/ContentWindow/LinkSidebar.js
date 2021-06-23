import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as e from './elements'
import withLazyLinkAttributes from '../LazyLinkAttributes'
import Link from './Link'
import { featureEnabled } from 'utils/features'

class LinkSidebar extends Component {
  static propTypes = {
    loadAttributes: PropTypes.func,
    parent: PropTypes.string,
    showLinkPreview: PropTypes.func,
    nodeTitle: PropTypes.string,
    hasNavBar: PropTypes.bool,
    attributes: PropTypes.obj,
    links: PropTypes.array,
    toggleLinkSidebar: PropTypes.func,
    showPreviewWindow: PropTypes.func,
  }
  state = {
    expanded: [],
    search: '',
  }
  toggleItem = (linkId) => {
    let expanded = [...this.state.expanded]

    if (expanded.includes(linkId)) {
      expanded = expanded.filter(item => item !== linkId)
    } else {
      expanded.push(linkId)
      this.props.loadAttributes(this.props.parent, linkId)
    }

    this.setState({
      expanded,
    })
  }

  onSearch = (e) => {
    this.setState({
      search: e.target.value,
    })
  }

  explore = (relative) => {
    if (featureEnabled('linkContentWindow')) {
      this.props.showLinkPreview(relative)
    }
  }

  render () {
    const { nodeTitle, hasNavBar, attributes, links } = this.props
    let top = featureEnabled('uploadImages') ? 154 : 0
    if (hasNavBar) {
      top += 50
    }

    return (
      <e.LinkSidebarContainer top={`${top}px`}>
        <section className='section'>
          <e.SearchContainer>
            <input type='search' onChange={this.onSearch} placeholder='Search' />
          </e.SearchContainer>
          {/* Temporarily disabled until functionality implemented */}
          {/* <e.Actions>
            <button type='button'>
              <img src={controls} alt='controls' width='21' height='21' />
            </button>
            <button type='button'>
              <img src={sortSvg} alt='sort' width='21' height='21' />
            </button>
          </e.Actions> */}
        </section>
        <ul>
          {links.length === 0 &&
          <li>
            <div className='header'>
              <h5>No results found</h5>
            </div>
          </li>}
          {links.filter(link => {
            if (this.state.search.length > 0) {
              return link.title.toLowerCase().includes(this.state.search.toLowerCase())
            }

            return true
          }).map(relative => {
            return <Link
              key={relative._id}
              link={relative}
              toggleExpanded={() => this.toggleItem(relative.linkId)}
              linkAttributes={attributes[relative.linkId]}
              expanded={!this.state.expanded.includes(relative.linkId)}
              nodeTitle={nodeTitle}
              toggleLinkSidebar={this.props.toggleLinkSidebar}
              showPreviewWindow={() => this.props.showPreviewWindow({ ...relative })}
              onExplore={() => this.explore(relative)}
            />
          })}
        </ul>
      </e.LinkSidebarContainer>
    )
  }
}

export default withLazyLinkAttributes(LinkSidebar)
