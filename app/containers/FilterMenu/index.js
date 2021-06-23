import {
  selectMiniClusters,
} from 'containers/FixedPath/selectors'
import {
  toggleMiniClusters,
} from 'containers/FixedPath/actions'
import {
  selectFilterWithin,
  selectTagFilters,
  selectShowOnOrbit,
  maybeSelectCountNodes,
} from './selectors'
import {
  updateFrameReference,
  updateTagFilters,
  updateShowOnOrbit,
} from './actions'
import {
  FilterList,
  Flex,
} from './elements'
import {
  filterNodeArray, filterShowOnOrbit,
} from '../../utils/filterNodes'
import { VENN_ID } from '../../constants'

import ActiveFilters from 'components/ActiveFilters'
import FilterPanel from 'components/FilterPanel'
import { SidebarMenu } from 'components/SideBarMenu'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  connect,
} from 'react-redux'
import {
  createStructuredSelector,
} from 'reselect'
import PathFilterResults from 'containers/PathFilterResults'

export class FilterMenu extends Component {
  static propTypes = {
    updateTagFilters: PropTypes.func,
    within: PropTypes.string,
    showOnOrbit: PropTypes.string,
    close: PropTypes.func,
    tagFilters: PropTypes.array,
    panelVisible: PropTypes.bool,
    open: PropTypes.func,
    updateFrameReference: PropTypes.func,
    updateShowOnOrbit: PropTypes.func,
    toggleMiniClusters: PropTypes.func,
    miniClusters: PropTypes.bool,
    countNodes: PropTypes.shape({
      nodes: PropTypes.object,
      relatives: PropTypes.object,
      focusedNode: PropTypes.object,
    }),
  }
  state = {
    search: '',
  }

  tagFilterCount = new Map()

  componentWillReceiveProps (newProps) {
    if (newProps.countNodes !== this.props.countNodes) {
      this.tagFilterCount.clear()
    }
  }
  clear = () => {
    this.props.updateTagFilters([])
  }
  _calculateCount (within, shown, filters) {
    const countNodes = this.props.countNodes
    if (within === 'venn-search' && countNodes.focusedNode._id === VENN_ID) {
      within = 'current-children'
      shown = 'all'
    }

    if (within === 'current-children') {
      const relatives = filterShowOnOrbit(countNodes.focusedNode.relatives, shown)
      return filterNodeArray(Object.values(relatives), filters).length
    } else if (within === 'all-children') {
      let relatives = {}
      // Combine relatives from all nodes into one object,
      // removing duplicates
      Object.values(countNodes.relatives).forEach(relatives => {
        Object.entries(relatives).forEach(([id, relative]) => {
          if (!(id in relatives)) {
            relatives[id] = relative
          }
        })
      })

      relatives = filterShowOnOrbit(relatives, shown)

      return filterNodeArray(Object.values(relatives), filters).length
    } else {
      console.warn('unknown within', within)
      return 0
    }
  }
  getCount = (tagFilter) => {
    const within = this.props.within

    let shown = this.props.showOnOrbit || 'children'
    let filters = [tagFilter]

    const key = JSON.stringify(tagFilter)
    if (this.tagFilterCount.has(key)) {
      return this.tagFilterCount.get(key)
    }

    const result = this._calculateCount(within, shown, filters)

    this.tagFilterCount.set(key, result)
    return result
  }

  updateShowOnOrbit = (value) => {
    this.tagFilterCount.clear()
    this.props.updateShowOnOrbit(value)
  }
  updateFrameReference = (value) => {
    this.tagFilterCount.clear()
    this.props.updateFrameReference(value)
  }

  render () {
    if (!this.props.panelVisible && this.props.tagFilters.length > 0) {
      return (
        <ActiveFilters
          open={this.props.open}
          clear={this.clear}
          getCount={this.getCount}
          tagFilters={this.props.tagFilters}
        />
      )
    } else if (!this.props.panelVisible) {
      return null
    }

    const showResults = this.props.within === 'all-children'

    return (
      <SidebarMenu
        width={showResults ? '580px' : '280px'}
        autoHeight={!showResults}
      >
        <Flex>
          <FilterList>
            <FilterPanel
              tagFilters={this.props.tagFilters}
              within={this.props.within}
              showOnOrbit={this.props.showOnOrbit}
              updateFrameReference={this.updateFrameReference}
              updateTagFilters={this.props.updateTagFilters}
              updateShowOnOrbit={this.updateShowOnOrbit}
              clear={this.clear}
              isSidebarMenu
              getCount={this.getCount}
              vennSearch={this.props.countNodes.focusedNode && this.props.countNodes.focusedNode._id === VENN_ID}
              toggleAutoFilter={this.props.toggleMiniClusters}
              autoFilter={this.props.miniClusters}
            />
          </FilterList>
          {
            showResults && <PathFilterResults
              tagFilters={this.props.tagFilters}
              close={this.props.close}
              showOnOrbit={this.props.showOnOrbit}
            />
          }
        </Flex>
      </SidebarMenu>
    )
  }
}

const mapStateToProps = createStructuredSelector({
  tagFilters: selectTagFilters(),
  within: selectFilterWithin(),
  showOnOrbit: selectShowOnOrbit(),
  miniClusters: selectMiniClusters,
  countNodes: maybeSelectCountNodes(),
})

const mapDispatchToProps = {
  updateTagFilters,
  updateFrameReference,
  updateShowOnOrbit,
  toggleMiniClusters,
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterMenu)
