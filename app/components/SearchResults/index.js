import {
  ResultList,
  SearchResults,
  Result,
} from './elements.js'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { List, CellMeasurer, CellMeasurerCache, InfiniteLoader } from 'react-virtualized'
import TopResults from './TopResults.js'
import { LinearProgress } from 'material-ui-core'
import { withStyles } from 'material-ui-core/styles'

const PlaceHolderLinearProgress = withStyles({
  colorPrimary: {
    backgroundColor: '#FFFFFF',
  },
  barColorPrimary: {
    backgroundColor: '#FFFFFF',
  },
})(LinearProgress)

export default class Results extends Component {
  static propTypes = {
    results: PropTypes.array,
    onClick: PropTypes.func,
    selected: PropTypes.string,
    showTop: PropTypes.bool,
    children: PropTypes.node,
    showCount: PropTypes.bool,
    heightOffset: PropTypes.number,
    totalCount: PropTypes.number,
    requestResults: PropTypes.func,
    // searchKey should change whenever the results change for a reason other
    // than pagination
    searchKey: PropTypes.string,
    isFetching: PropTypes.bool,
  }
  static defaultProps = {
    results: [],
    showCount: true,
  }
  cache = new CellMeasurerCache({
    minHeight: 30,
    fixedWidth: true,
  });
  requested = new Map()
  promises = new Map()
  infiniteLoader = null

  rowRenderer = ({ index, key, parent, style }) => {
    const { results } = this.props
    const result = results[index] || {
      title: 'Loading...',
      childCount: '',
    }

    return <CellMeasurer
      cache={this.cache}
      columnIndex={0}
      key={key}
      rowIndex={index}
      parent={parent}>
      <Result
        style={style}
        onClick={() => this.props.onClick(index, result)}
      >
        <span>{result.title}</span>
        {result.childCount && this.props.showCount > 0 && <span>{result.childCount}</span>}
      </Result>
    </CellMeasurer>
  }

  isRowLoaded = ({ index }) => {
    const {
      results,
    } = this.props
    return results[index] || this.requested.get(index)
  }

  loadMoreRows = ({ startIndex, stopIndex }) => {
    for (let i = startIndex; i <= stopIndex; i++) {
      this.requested.set(i, true)
    }

    this.props.requestResults(startIndex, stopIndex)

    // We need to resolve a promise when the results are loaded
    // for the infinite loader to work.
    // Since the parent handles loading the results, we
    // instead resolve when the props change and the new results includes
    // the startIndex
    let resolver
    const promise = new Promise((resolve) => {
      resolver = resolve
    })
    this.promises.set(startIndex, resolver)

    return promise
  }

  render () {
    const {
      results,
      totalCount,
      isFetching,
    } = this.props
    if (this.props.showTop) {
      return (
        <div>
          {isFetching ? <LinearProgress /> : <PlaceHolderLinearProgress /> }
          <TopResults
            onClick={this.props.onClick}
            results={results}
            showCount={this.props.showCount}
            selected={this.props.selected}
            totalCount={this.props.totalCount}
          >
            {this.props.children}
          </TopResults>
        </div>
      )
    }

    const height = results.length === 0 ? 0 : window.innerHeight - (this.props.heightOffset || 0)

    let total = (totalCount || results.length)

    if (total < 0) {
      total = 0
    }

    return (
      <SearchResults>
        <ResultList>
          <InfiniteLoader
            isRowLoaded={this.isRowLoaded}
            loadMoreRows={this.loadMoreRows}
            rowCount={total}
            minimumBatchSize={100}
            ref={ref => { if (ref === null) { return } this.infiniteLoader = ref }}
          >
            {({ onRowsRendered, registerChild }) => (
              <List
                height={height}
                ref={(ref) => { this.listRef = ref; registerChild(ref) }}
                onRowsRendered={onRowsRendered}
                deferredMeasurementCache={this.cache}
                rowHeight={this.cache.rowHeight}
                rowCount={total}
                rowRenderer={this.rowRenderer}
                width={300}
              />
            )}
          </InfiniteLoader>
        </ResultList>
        {this.props.children}
      </SearchResults>
    )
  }
  componentWillReceiveProps (newProps) {
    if (this.props.searchKey !== newProps.searchKey) {
      this.cache.clearAll()
      this.promises.clear()
      this.requested.clear()
      this.infiniteLoader && this.infiniteLoader.resetLoadMoreRowsCache(true)
      this.listRef && this.listRef.forceUpdateGrid()
    }

    this.promises.forEach((resolve, key, map) => {
      if (newProps.results[key]) {
        resolve()
        map.delete(key)
      }
    })
  }
}
