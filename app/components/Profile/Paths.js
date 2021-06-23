import React, { Component } from 'react'
import { getPaths, getPath } from 'api/path'
import { getNode } from 'api/node'
import Timeline from '../Timeline'
import { lineageFromPath } from 'utils/fixed-path'
import { formatDateTitle } from 'utils/dates'
import Definition from '../NodeDefinition'
import { uniqueId } from 'lodash-es'

export default class Paths extends Component {
  state = {
    paths: null,
    expanded: null,
    nodeDescriptions: {},
  }
  componentDidMount () {
    getPaths().then(({ data: { data } }) => {
      return Promise.all(data._documents.map((_document) => getPath(_document._id)))
    }).then(paths => {
      return paths.map(({ data }) => data.data)
    }).then(paths => {
      // TODO: we probably should use infinite scrolling and only
      // load the paths needed
      this.setState({
        paths: paths.sort((path1, path2) => path2.u_at - path1.u_at).map(path => {
          path.data = JSON.parse(path.data)

          const {
            lineage,
            maxExpandedIndex,
          } = lineageFromPath(path.data) || {}

          if (!lineage) {
            return null
          }

          path.lineage = lineage
          path.maxExpandedIndex = maxExpandedIndex
          path.active = path._key === this.props.activePathId || true
          path.c_at = new Date(path.c_at)
          path.u_at = new Date(path.u_at)

          return path
        }).filter(path => path !== null),
      })
    })
  }
  createPathTitle (createdDate, updatedDate) {
    const formattedCreate = formatDateTitle(createdDate)
    const formattedUpdate = formatDateTitle(updatedDate)

    if (formattedCreate !== formattedUpdate) {
      return `${formattedCreate} to ${formattedUpdate}`
    } else {
      return formatDateTitle(createdDate)
    }
  }
  createItems = (lineage, path) => {
    return lineage.map(item => {
      return {
        ...item,
        text: item.name,
        active: item._id === this.props.focusedNode._id && path.active,
        expanded: this.state.expanded && this.state.expanded.path === path._key && this.state.expanded.item === item._id,
      }
    })
  }
  loadNodeDefinition = (nodeKey) => {
    if (nodeKey in this.state.nodeDescriptions) {
      return
    }

    return getNode(nodeKey).then(result => {
      this.setState({
        nodeDescriptions: {
          ...this.state.nodeDescriptions,
          [nodeKey]: result.data.node.a.description,
        },
      })
    })
  }
  toggleExpanded = (itemId, pathId) => {
    const expanded = this.state.expanded

    if (expanded && expanded.path === pathId && expanded.item === itemId) {
      this.setState({
        expanded: null,
      })
    } else {
      this.setState({
        expanded: {
          path: pathId,
          item: itemId,
        },
      })
      this.loadNodeDefinition(itemId)
    }
  }
  renderDefinition = (item) => {
    return (
      <div style={{ width: '100%' }}>
        <Definition
          definition={item._id in this.state.nodeDescriptions ? this.state.nodeDescriptions[item._id] : 'Loading...'}
        />
      </div>
    )
  }
  render () {
    const { paths } = this.state
    if (paths === null) {
      return <p>Loading...</p>
    }
    if (paths !== null && paths.length === 0) {
      return <p>No paths yet</p>
    }

    return (
      <div>
        {
          paths.map(path =>
            <Timeline
              key={uniqueId('timeline')}
              title={this.createPathTitle(path.c_at, path.u_at)}
              items={this.createItems(path.lineage, path)}
              onSelect={(itemId) => this.toggleExpanded(itemId, path._key)}
              onTitleSelect={() => { this.props.confirmRestoreSavedPath(path) }}
              expandedRenderer={this.renderDefinition}
            />)
        }
      </div>
    )
  }
}
