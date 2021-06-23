import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  LinkRow,
  Container,
  Toolbar,
  Content,
  SearchIcon,
  Search,
  Button,
  SelectedCount,
} from './elements'
import Definition from './definition'
import searchIcon from './search.svg'
import trashIcon from './trash.svg'
import {
  flatten,
} from 'lodash-es'
import Link from './Link'

export default class LineageEditor extends Component {
  state = {
    selected: [],
    expanded: -1,
    search: '',
  }
  onSelected = (index) => {
    const selected = [...this.state.selected]
    if (selected.includes(index)) {
      selected.splice(selected.indexOf(index), 1)
    } else {
      selected.push(index)
    }

    this.setState({
      selected,
    })
  }
  allSelected = () => {
    const selected = this.state.selected
    const visible = this.visibleLinks()

    return selected.length !== 0 && selected.length === visible.length &&
      visible.every(link => selected.includes(this.actualIndex(link)))
  }
  actualIndex = (link) => {
    return this.props.links.indexOf(link)
  }
  toggleSelectAll = () => {
    let selected = []
    if (!this.allSelected()) {
      selected = this.visibleLinks().map(link => this.actualIndex(link))
    }

    this.setState({
      selected,
    })
  }
  linkInResults = (link) => {
    let query = this.state.search.toLowerCase()
    let title = link.node.title.toLowerCase()

    return title.indexOf(query) > -1
  }
  onDeleteLinks = () => {
    this.setState({
      selected: [],
    })

    this.props.onDeleteLinks(this.state.selected.map(index => {
      return this.props.links[index]
    }))
  }
  showPreview = (link) => {
    this.props.showLinkPreview(
      link.isParent ? this.props.nodeKey : link.node._id,
      link.isParent ? link.node._id : this.props.nodeKey
    )
  }
  visibleLinks = () => {
    return this.props.links.filter(link => this.linkInResults(link))
  }
  render () {
    const {
      onLinkVerbChanged,
      verbs,
      title,
      showCreateVerb,
      showAddLinkWindow,
    } = this.props
    const visibleLinks = this.visibleLinks()

    return (
      <div>
        <Container>
          <Toolbar>
            <SearchIcon src={searchIcon} />
            <Search placeholder='Search' type='search' value={this.state.search} onChange={e => this.setState({ search: e.target.value })} />
          </Toolbar>
          <Content>
            <table>
              <LinkRow><td><input type='checkbox' checked={this.allSelected()} onChange={this.toggleSelectAll} /></td><td colSpan={5}>ALL ({visibleLinks.length})</td></LinkRow>
              {/* After updating to react 15, we can remove flatten */}
              {flatten(visibleLinks.map((link) => {
                const index = this.actualIndex(link)

                return [<Link
                  key={index}
                  index={index}
                  link={link}
                  onLinkVerbChanged={onLinkVerbChanged}
                  verbs={verbs}
                  nodeTitle={title}
                  showCreateVerb={showCreateVerb}
                  onLinkChecked={this.onSelected}
                  selected={this.state.selected.includes(index)}
                  expanded={index === this.state.expanded}
                  toggleExpand={(index, expanded) => this.setState({ expanded: expanded ? index : -1 })}
                />,
                index === this.state.expanded ? <Definition showPreview={() => this.showPreview(link)} definition={link.definition} /> : null,
                ]
              }
              ))}
            </table>
          </Content>
          <Toolbar justify='flex-end'>
            <Button onClick={showAddLinkWindow}><span>+</span>Create</Button>
            <Button negative disabled={this.state.selected.length === 0} onClick={this.onDeleteLinks}><img src={trashIcon} />Delete</Button>
          </Toolbar>
        </Container>
        <SelectedCount>{this.state.selected.length || 0} link{this.state.selected.length !== 1 ? 's' : ''} selected</SelectedCount>
      </div>
    )
  }
}

LineageEditor.propTypes = {
  links: PropTypes.array,
  onLinkVerbChanged: PropTypes.func,
  verbs: PropTypes.array,
  title: PropTypes.string,
  showCreateVerb: PropTypes.func,
  showLinkPreview: PropTypes.func,
}
