import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  selectRelatives,
  selectNodes,
} from 'containers/FixedPath/selectors'
import {
  selectShowOnOrbit,
} from 'containers/FilterMenu/selectors'
import {
  filterNodeArray,
  filterShowOnOrbit,
} from '../../utils/filterNodes'
import SearchResults from 'components/SearchResults'
import {
  createStructuredSelector,
} from 'reselect'
import { findNodeWithRelative } from '../../utils/fixed-path'
import PropTypes from 'prop-types'
import {
  focusNode,
  openMenuFor,
} from 'containers/FixedPath/actions'

export class PathFilterResults extends Component {
  static propTypes = {
    tagFilters: PropTypes.array,
    close: PropTypes.func,
    showOnOrbit: PropTypes.string,
    relatives: PropTypes.object,
    nodes: PropTypes.object,
    openMenuFor: PropTypes.func,
    focusNode: PropTypes.func,
  }
  // Mutates results that have duplicate titles to include
  // the name of the node they are on the orbit of
  renameDuplicateResults = (results, relativeToParent) => {
    // Mutates node's title to include the parent's name
    const fixTitle = (node) => {
      const parentId = relativeToParent[node._id]
      node.title = `${node.title} (Origin: ${this.props.nodes[parentId].title})`
      return node
    }

    // Renames nodes with duplicate titles to include the node they are on the orbit of
    // Since results could be very large, we only loop over it once.
    // It keeps track of the names it has seen, and goes back to the first occurrence
    // when it finds the second. After the second, it updates the duplicate names as it
    // finds them.
    const resultsByTitle = Object.create(null)
    results.forEach((result, index) => {
      if (result.title in resultsByTitle) {
        if (resultsByTitle[result.title].length === 1) {
          // We have found the second occurrence. Go back to the
          // first occurrence and fix it
          const firstIndex = resultsByTitle[result.title][0]
          fixTitle(results[firstIndex])
        }

        resultsByTitle[result.title].push(index)
        fixTitle(result)
      } else {
        resultsByTitle[result.title] = [index]
      }
    })

    return results
  }
  getResults = () => {
    const shown = this.props.showOnOrbit || 'children'
    const relativeToParent = {}
    const combined = Object.entries(this.props.relatives)
      .reduce((relatives, [nodeKey, result]) => {
        Object.entries(relatives).forEach(([id, relative]) => {
          if (!(id in result)) {
            relativeToParent[id] = nodeKey
            result[id] = relative
          }
        })

        return result
      }, {})
    let results = filterShowOnOrbit(
      combined,
      shown
    )

    results = filterNodeArray(
      Object.values(results),
      this.props.tagFilters
    ).sort((node1, node2) => {
      return (node2.count || 0) - (node1.count || 0)
    })

    return this.renameDuplicateResults(results, relativeToParent)
  }
  resultClicked = (index, result) => {
    const nodeId = result._id
    this.props.close()

    if (nodeId in this.props.nodes) {
      // is a node on the path
      this.props.focusNode(nodeId)
    } else {
      let parent = findNodeWithRelative(nodeId, this.props.relatives)
      this.props.focusNode(parent)
      this.props.openMenuFor(nodeId)
    }
  }

  render () {
    const results = this.getResults()

    return (
      <SearchResults results={results} onClick={this.resultClicked} />
    )
  }
}

const mapStateToProps = createStructuredSelector({
  nodes: selectNodes,
  relatives: selectRelatives,
  showOnOrbit: selectShowOnOrbit(),
})
const mapDispatchToProps = {
  focusNode,
  openMenuFor,
}

export default connect(mapStateToProps, mapDispatchToProps)(PathFilterResults)
