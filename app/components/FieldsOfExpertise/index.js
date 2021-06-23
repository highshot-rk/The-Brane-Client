import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Window, WindowHeader } from 'elements/window'
import searchIcon from './icons/search.svg'
import {
  Toolbar,
  SearchIcon,
  Search,
  Content,
  SelectedGroup,
  Container,
  DismissButton,
  DeleteButton,
  PreviousButton,
  SearchFilter,
} from './elements'
import Arrow from './icons/Arrow'
import { RemoveRowButton, Submit } from 'elements/form'
import Breadcrumbs from 'components/Breadcrumbs'
import {
  tagTree,
} from 'utils/filter-tags'
import {
  keyToTree,
  clusterKeyToTagPath,
} from 'utils/tags'
import { groupBy } from 'lodash-es'
import { getNode, searchNodes } from 'api/node'
import { fuzzySearchNodes } from 'containers/Search/sagas'
import List from './List'

export default class FieldsOfExpertise extends Component {
  state = {
    searchValue: '',
    searchResults: [],
    path: [],
    nodes: [],
  }

  searchAllNodes = (query) => {
    searchNodes(query).then(({ results }) => {
      results = fuzzySearchNodes(results.data, query)

      this.setState({
        searchResults: results.map(result => ({
          _key: result.category._key,
          title: result.category.t,
          children: [],
          cl: result.category.cl,
          clusters: result.parents.filter(parent => parent.cl),
        })).filter(result => result.clusters.length > 0),
      })
    })
  }
  onSearch = async (event) => {
    let value = event ? event.target.value : this.state.searchValue
    const newState = {
      searchValue: value,
    }

    if (this.state.path.length > 0) {
      const compareValue = value.toLowerCase()

      newState.searchResults = this.visibleNodes().filter(
        subject => subject.title.toLowerCase().includes(compareValue)
      )
    } else {
      this.searchAllNodes(value)
    }

    this.setState(newState)
  }
  isSelected = node => {
    return this.props.selected.find(subject => subject._key === node._key)
  }
  addSubject = sub => {
    if (this.isSelected(sub)) {
      return
    }

    const selected = this.props.selected
    let parent

    if (sub.clusters) {
      parent = {
        _key: sub.clusters[0]._key,
        title: sub.clusters[0].t,
      }
    } else if (this.state.path.length === 0) {
      parent = sub
    } else {
      const path = clusterKeyToTagPath(sub._key)
      parent = path[path.length - 2]
    }

    this.props.onChange([
      ...selected,
      {
        _key: sub._key,
        title: sub.title,
        count: sub.children.length,
        parent: {
          title: parent.title,
          _key: parent._key,
        },
      },
    ])
  }

  removeSubject = sub => {
    this.props.onChange(
      this.props.selected.filter(subject => subject._key !== sub._key)
    )
  }

  addToPath = (cluster) => {
    this.setState({
      path: [
        ...this.state.path,
        {
          _key: cluster._key,
          title: cluster.title,
        },
      ],
    })

    this.loadChildren(cluster._key)
  }

  loadChildren = (nodeKey) => {
    getNode(nodeKey)
      .then(({ data }) => {
        this.setState({
          nodes: {
            ...this.state.nodes,
            [nodeKey]: data.children
              .filter(child => !child.cl)
              .map(child => ({
                _key: child._id,
                title: child.title,
                children: [],
                cl: false,
                clusters: child.clusters,
              })),
          },
        })
      })
  }

  handleBreadcrumbClick = (key) => {
    const index = this.state.path.findIndex(subject => subject._key === key)

    this.setState({
      path: this.state.path.slice(0, index),
    }, this.onSearch)
  }

  clearSearchFilter = () => {
    this.setState({
      path: [],
    }, this.onSearch)
  }

  visibleNodes = () => {
    function sorter (child1, child2) {
      if (child1.children.length !== child2.children.length) {
        return child2.children.length - child1.children.length
      }

      return child1.title.localeCompare(child2.title)
    }

    if (this.state.path.length === 0) {
      return tagTree.sort(sorter)
    }

    const lastCluster = this.state.path[this.state.path.length - 1]._key

    return keyToTree(lastCluster)
      .children
      .sort(sorter)
      .concat(this.state.nodes[lastCluster] || [])
  }

  groupSelected = () => {
    return Object.values(groupBy(this.props.selected, 'parent._key'))
  }

  render () {
    const { searchValue, searchResults, path } = this.state
    const { selected } = this.props

    return (
      <Window style={{ minWidth: '600px' }}>
        <WindowHeader style={{ marginBottom: 0, marginTop: 20 }}>What specific subject(s) do you specialise in? </WindowHeader>
        <p style={{ textAlign: 'center' }}>(e.g., your field(s) of study, or topic(s) of interest)</p>
        <Container>
          <section>
            <Toolbar>
              <SearchIcon src={searchIcon} />
              <Search placeholder='Search' type='search' value={searchValue} onChange={this.onSearch} />
              {searchValue.length > 0 && path.length > 0 && <SearchFilter onClick={this.clearSearchFilter}>Search within: {path[path.length - 1].title} &times;</SearchFilter>}
            </Toolbar>
            <Content>
              {path.length > 0 && <Breadcrumbs crumbs={path} onClick={this.handleBreadcrumbClick} />}
              <List
                results={searchValue.length > 0 ? searchResults : this.visibleNodes()}
                onAddToPath={this.addToPath}
                onAddSubject={this.addSubject}
                isSearch={searchValue.length > 0}
                isSelected={key => selected.find(subject => subject._key === key)}
              />
            </Content>

          </section>
          <section>
            <h2>Selected nodes {selected.length ? `(${selected.length})` : ''}</h2>
            <Content>
              {this.groupSelected().map(subjects => (
                <SelectedGroup key={`parent-${subjects[0].parent._key}`}>
                  <h6>{subjects[0].parent.title}</h6>
                  {subjects.map(subject => (
                    <RemoveRowButton style={{ marginTop: 11 }} onClick={() => this.removeSubject(subject)} key={`selected-${subject._key}`} >
                      <DeleteButton >-</DeleteButton>
                      <span>{subject.title}</span>
                    </RemoveRowButton>
                  ))}
                </SelectedGroup>
              ))
              }
            </Content>
          </section>
        </Container>
        <Submit onClick={this.props.onContinue}>
          Complete
        </Submit>
        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <PreviousButton onClick={this.props.onPrevious}>
            <Arrow color='#646464' />
            Previous
          </PreviousButton>
          <DismissButton onClick={this.props.onDismiss} >
            Do it later
          </DismissButton>
        </div>
      </Window>
    )
  }
}

FieldsOfExpertise.propTypes = {
  onContinue: PropTypes.func,
  onDismiss: PropTypes.func,
  onPrevious: PropTypes.func,
  onChange: PropTypes.func,
  selected: PropTypes.array,
}
