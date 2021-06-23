import {
  FilterList,
  Flex,
  Queries,
  SearchTitle,
  VennDiagramToggle,
  SearchActions,
  Separator,
  Clear,
  LoadingWrapper,
} from './elements'
import {
  addQuery,
  queriesLocked,
  removeQuery,
  search,
  updateFrameReference,
  updateQuery,
  updateSelected,
  updateTagFilters,
  updateOperator,
  updateActiveQuery,
  requestResults,
} from './actions'
import {
  selectFilterWithin,
  selectQueries,
  selectQueriesLocked,
  selectResults,
  selectVennDiagramSearch,
  selectTagFilters,
  selectActiveQuery,
  selectLoading,
  selectTotalResults,
  selectFetching,
  selectTagCounts,
} from './selectors'
import { selectSingleNodeView, selectMenu } from 'containers/FixedPath/selectors'
import * as keycodes from '../../utils/key-codes'
import AddDropDown from './AddDropDown'
import CenterSearch from 'components/CenterSearch'
import DropDown from 'components/DropDown'
import FilterPanel from 'components/FilterPanel'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Results from 'components/SearchResults'
import Switch from 'components/Switch'
import SearchInput from './searchInput'
import {
  SidebarMenu,
} from 'components/SideBarMenu'
import {
  connect,
} from 'react-redux'
import {
  createStructuredSelector,
} from 'reselect'
import { filterNodeArray } from '../../utils/filterNodes'
import { startSearch } from 'containers/FixedPath/actions'
import xIcon from './icons/x.svg'
import keycoder from 'keycoder'
import NoResults from './NoResults'
import { selectWelcome } from '../HomePage/selectors'
import {
  showNodeCreationWindow,
} from '../HomePage/actions'
import {
  VENN_ID, ROOT_NODE_TITLE,
} from '../../constants'
import {
  symbolFromQueryType,
} from 'utils/venn.js'
import { trackEvent } from 'utils/analytics'

const searchWithinOptions = [
  {
    type: 'section',
    text: ROOT_NODE_TITLE,
  },
  {
    value: 'all-brane',
    text: 'Everything',
  },
  {
    type: 'section',
    text: 'Current Node',
  },
  {
    value: 'focused-related',
    text: 'All related nodes',
  },
  {
    type: 'section',
    text: 'Path',
  },
  {
    value: 'all-related',
    text: 'All related nodes',
  },
  {
    value: 'all-nodes',
    text: 'Path nodes',
  },
]

const MAX_TOP_RESULTS = 12

export class Search extends Component {
  static propTypes = {
    vennDiagramSearch: PropTypes.bool,
    panelVisible: PropTypes.bool,
    overlayOpen: PropTypes.bool,
    welcome: PropTypes.bool,
    bothLocked: PropTypes.bool,
    loading: PropTypes.bool,
    activeQuery: PropTypes.number,
    query: PropTypes.string,
    within: PropTypes.string,
    queries: PropTypes.array,
    results: PropTypes.array,
    tagFilters: PropTypes.array,
    fixedPathSingleNodeView: PropTypes.object,
    open: PropTypes.func,
    close: PropTypes.func,
    updateTagFilters: PropTypes.func,
    updateSelected: PropTypes.func,
    addQuery: PropTypes.func,
    queriesLocked: PropTypes.func,
    updateQuery: PropTypes.func,
    removeQuery: PropTypes.func,
    updateActiveQuery: PropTypes.func,
    updateOperator: PropTypes.func,
    startSearch: PropTypes.func,
    createNode: PropTypes.func,
    updateFrameReference: PropTypes.func,
    requestResults: PropTypes.func,
    totalResults: PropTypes.number,
    isFetching: PropTypes.bool,
    tagCounts: PropTypes.object,
  }

  state = {
    advancedSearch: false,
    showAll: false,
    selected: '',
    addQueryExpanded: false,
  }
  focusQuery = 'none'
  selectAll = false
  searchInputs = []
  filterCount = new Map()

  toggleAdvanced = () => {
    this.setState({
      advancedSearch: !this.state.advancedSearch,
    })
  }
  clearTagFilters = () => {
    this.props.updateTagFilters([])
  }
  getCount = (tagFilter) => {
    const key = JSON.stringify(tagFilter)
    if (this.filterCount.has(key)) {
      return this.filterCount.get(key)
    }
    // TODO: we could cache the results, and only invalidate it if the node id or children length is different
    const result = filterNodeArray(this.props.results, [tagFilter]).length
    this.filterCount.set(key, result)

    return result
  }
  onKeyDown = (e) => {
    if (
      ![keycodes.ARROW_DOWN, keycodes.ARROW_UP].includes(e.keyCode) ||
      this.props.results.length === 0
    ) {
      return
    }

    let results = this.visibleResults()
    let selectedIndex = this.selectedIndex()

    selectedIndex += e.keyCode === keycodes.ARROW_DOWN ? 1 : -1

    if (selectedIndex > results.length - 1) {
      selectedIndex = 0
    } else if (selectedIndex < 0) {
      selectedIndex = results.length - 1
    }
    this.setState({
      selected: selectedIndex === 0 ? '' : results[selectedIndex]._id,
    })

    e.preventDefault()
  }
  allLocked = (queryIndex = -1) => {
    return this.props.queries.every((query, index) => {
      const isParenthesis = ['open-parenthesis', 'close-parenthesis'].includes(query.type)

      return query.id !== null || index === queryIndex || isParenthesis
    })
  }
  addQuery = (queryIndex) => {
    this.props.addQuery(queryIndex)
    this.setState({
      advancedSearch: true,
      operatorExpanded: null,
    })
  }
  startSearch = (index, result) => {
    const queryIndex = this.props.activeQuery
    let queries = this.props.queries.filter(query => {
      return query.id !== null &&
        query.type !== 'close-parenthesis' &&
        query.type !== 'open-parenthesis'
    })
    result = result || this.visibleResults()[index]
    if (this.props.vennDiagramSearch && !this.allLocked()) {
      this.focusQuery = queryIndex + 1
      this.props.updateSelected(result._id, result.title, queryIndex)

      if (this.allLocked(queryIndex)) {
        this.props.queriesLocked()
      }

      return
    }

    let vennIds = []
    if (this.props.vennDiagramSearch) {
      vennIds = queries.slice()

      result = {
        _id: VENN_ID,
        title: queries.map(query => `${symbolFromQueryType(query.type)} ${query.query}`).join(' '),
        relatives: [],
        queryInfo: this.props.queries.slice(),
      }
    }

    if (result) {
      trackEvent('search', { venn: vennIds.length > 0, termCount: queries.length })
      this.props.startSearch({
        ...result,
        relatives: [],
        _id: result._id,
        vennIds,
      })
    }
  }

  query = () => {
    return this.props.queries[this.props.activeQuery].query
  }

  filterResults = (results, tagFilters) => {
    const resultsEmpty = this.props.activeQuery === 0 && this.query().length === 0
    tagFilters = tagFilters || this.props.tagFilters
    results = results || this.props.results
    results = resultsEmpty ? [] : results.slice()

    if (this.state.advancedSearch && tagFilters.length > 0) {
      results = filterNodeArray(
        results,
        tagFilters
      )
    }

    return results
  }

  onChange = (e, queryIndex = 0) => {
    if (e.target.value !== ' ') {
      this.props.updateQuery(e.target.value, queryIndex)
    }
    if (e.target.value === '') {
      this.setState({
        showAll: false,
      })
    }

    if (this.props.welcome) {
      this.props.open()
      this.focusQuery = 0
    } else if (this.state.addQueryExpanded) {
      this.setState({
        addQueryExpanded: false,
      })
    }
  }
  selectedIndex = (visibleResults) => {
    visibleResults = visibleResults || this.visibleResults()
    const _id = this.state.selected

    function default0 (index) {
      return index === -1 ? 0 : index
    }

    if (_id.length === 0) {
      return 0
    }

    return default0(visibleResults.findIndex(node => node._id === _id))
  }

  toggleVennDiagram = () => {
    if (this.props.vennDiagramSearch) {
      this.props.removeQuery()
      this.focusQuery = 0
    }
  }

  removeQuery = (index) => {
    this.props.removeQuery(index)

    if (index > 0 && this.props.queries[index - 1].id) {
      this.focusQuery = index - 1
      this.props.updateSelected(
        null,
        this.props.queries[index - 1].query,
        index - 1
      )
    }
  }

  toggleAddQueryExpanded = (expanded) => {
    this.setState({
      addQueryExpanded: expanded,
    })
  }

  focused = (queryIndex) => {
    this.props.updateActiveQuery(queryIndex)
    this.props.updateQuery(this.props.queries[queryIndex].query, queryIndex)
  }

  lockedQueryClicked = (queryIndex) => {
    this.focusQuery = queryIndex
    this.props.updateActiveQuery(queryIndex)

    // check if followed by parenthesis
    let query = this.props.queries[queryIndex].query
    let removeNextOperator = false

    if (this.props.queries[queryIndex + 1] && this.props.queries[queryIndex + 1].type === 'open-parenthesis') {
      query = `(${query}`
      removeNextOperator = true
    }
    if (this.props.queries[queryIndex + 1] && this.props.queries[queryIndex + 1].type === 'close-parenthesis') {
      query = `${query})`
      removeNextOperator = true
    }

    this.props.updateSelected(null, query, queryIndex)
    if (removeNextOperator) {
      this.props.removeQuery(queryIndex + 1)
    }
  }

  inputRef = (e, queryIndex) => {
    this.searchInputs[queryIndex] = e
    this.searchInputs[0] && this.searchInputs[0].focus()
  }

  clearQueries = () => {
    for (let i = this.props.queries.length - 1; i > 0; i--) {
      this.removeQuery(i)
    }

    // Clear remaining query
    this.props.updateSelected(
      null,
      '',
      0
    )
  }

  tagCount = (tag, results = this.props.results, tagResults = []) => {
    if (tag.title === 'Other') {
      return Math.max(this.props.totalResults - MAX_TOP_RESULTS, 0) + tagResults.length
    }

    if (tag._key in this.props.tagCounts) {
      return this.props.tagCounts[tag._key]
    }

    // Fallback to filtering what results we have
    // loaded locally. This is always used when searching
    // the path.
    return results.filter(node => {
      const tagPath = node.tagList[0]

      return tagPath && tagPath[tagPath.length - 1]._key === tag._key
    }).length
  }
  groupedResults = (results = this.props.results) => {
    const topResults = this.filterResults(results)
      .map(node => {
        if (node.tagList && node.tagList.length > 0) {
          return node
        }

        return {
          ...node,
          tagList: [[{
            _key: 'other',
            title: 'Other',
          }]],
        }
      })
      .slice(0, MAX_TOP_RESULTS)
    const goodVennResults = this.props.queries.length > 1 &&
      topResults.filter(result => result.childCount > 1).length > 0
    const resultTags = {}

    topResults.forEach((result, index) => {
      const tagPath = result.tagList[0]
      const tag = tagPath[tagPath.length - 1]

      if (goodVennResults && result.count < 2) {
        return
      }

      if (resultTags[tag._key]) {
        resultTags[tag._key].results.push(result)
      } else {
        resultTags[tag._key] = {
          _key: tag._key,
          name: tag.title,
          index,
          results: [result],
          count: this.tagCount(tag, results),
        }
      }
    })

    if ('other' in resultTags) {
      resultTags.other.count = this.tagCount({ title: 'Other' }, results, resultTags.other.results)
    }

    return Object.values(resultTags).sort((tag1, tag2) => tag1.index - tag2.index)
  }
  queriesToString = () => {
    return this.props.queries.map(query => `${symbolFromQueryType(query.type)} ${query.query}`).join(' ')
  }
  visibleResults = (results = this.props.results, tagFilters = this.props.tagFilters) => {
    // search-dialog-present...
    if (this.allLocked()) {
      return [{
        _id: 'execute-search',
        title: this.queriesToString(),
        // TODO: get count from server
        count: 0,
      }]
    }

    if (this.state.showAll) {
      return this.filterResults(results, tagFilters)
    }

    return this.groupedResults(results).reduce((result, family) => {
      return result.concat(family.results)
    }, [])
  }

  updateOperator = (index, operator) => {
    this.props.updateOperator(index, operator)

    this.setState({
      operatorExpanded: -1,
    })
  }

  // Closes search when transparent area beneath results is clicked
  clickEmptySpace = (e) => {
    // Make sure it was clicked and not a child
    if (e.target === e.currentTarget) {
      this.props.close()
    }
  }

  render () {
    if (!this.props.welcome && !this.props.panelVisible) {
      return null
    }
    const results = this.filterResults()
    const allLocked = this.allLocked()
    const showAll = this.state.showAll || allLocked
    if (this.props.welcome) {
      if (this.props.fixedPathSingleNodeView.show) {
        return null
      }

      return (
        <CenterSearch
          onChange={this.onChange}
          value={this.props.query} />
      )
    }

    const queryElements = []
    this.props.queries.forEach((query, i) => {
      if (query.type === 'open-parenthesis') {
        return
      }
      if (i > 0) {
        queryElements.push(
          <AddDropDown
            key={`${i}-toggle`}
            expanded={this.state.operatorExpanded === i}
            toggleExpanded={() => this.setState({ operatorExpanded: this.state.operatorExpanded === i ? -1 : i })}
            selected={symbolFromQueryType(query.type)}
            addQuery={type => this.props.updateOperator(i, type)}
            onRemove={() => this.removeQuery(i)}
          >
            {symbolFromQueryType(query.type)}
          </AddDropDown>
        )
      }
      let nextQuery = this.props.queries[i + 1]
      if (nextQuery && nextQuery.type === 'open-parenthesis') {
        queryElements.push(
          <VennDiagramToggle key={`${i + 1}-toggle`} onClick={this.toggleVennDiagram} enabled={this.props.vennDiagramSearch}>
            {symbolFromQueryType(nextQuery.type)}
          </VennDiagramToggle>
        )
      }

      if (query.type === 'close-parenthesis') {
        return
      }

      queryElements.push(
        <SearchInput
          name={i}
          key={i}
          vennDiagram={this.props.queries.length > 1}
          onFocus={this.focused}
          onChange={this.onChange}
          value={this.props.queries[i].query}
          onKeyDown={this.onKeyDown}
          onLockClicked={this.lockedQueryClicked}
          locked={this.props.queries[i].id}
          bothLocked={this.props.bothLocked}
          inputRef={this.inputRef}
        />
      )

      if (i === this.props.queries.length - 1 && allLocked) {
        queryElements.push(
          <Clear key={'clear'} onClick={this.clearQueries}>
            <img src={xIcon} alt='Clear search' />
          </Clear>
        )
      }
    })

    return (
      <SidebarMenu
        width={this.state.advancedSearch ? '580px' : '300px'}
        background='transparent'
        autoHeight={!this.state.advancedSearch}
      >
        <SearchTitle expanded={this.state.advancedSearch}>
          <AddDropDown
            addQuery={this.addQuery}
            expanded={this.state.addQueryExpanded}
            toggleExpanded={this.toggleAddQueryExpanded}
          />
          <Queries>
            { queryElements }
          </Queries>

          <div className='advanced-slider'>
            <span>Advanced</span>
            <Switch
              onChange={this.toggleAdvanced}
              checked={this.state.advancedSearch}
            />
          </div>
        </SearchTitle>
        {
          this.state.advancedSearch &&
          <DropDown label='Search Within' options={searchWithinOptions} selected={this.props.within} onChange={this.props.updateFrameReference} />
        }
        <Flex onClick={this.clickEmptySpace}>
          {this.state.advancedSearch &&
          <FilterList>
            <FilterPanel
              tagFilters={this.props.tagFilters}
              within={this.props.within}
              updateTagFilters={this.props.updateTagFilters}
              clear={this.clearTagFilters}
              hideDropDown
              getCount={this.getCount}
            />
          </FilterList>
          }
          {
            (
              (results.length || allLocked || !this.props.loading) &&
              (this.query().length > 0 || (this.props.activeQuery > 0 && !this.props.loading && results.length > 0))
            ) &&
            <Results
              showTop={!showAll}
              results={showAll ? this.visibleResults() : this.groupedResults()}
              onClick={this.startSearch}
              selected={this.state.selected}
              heightOffset={45 + 217 + (this.state.advancedSearch ? 50 : 0)}
              // TODO: the search key should include the filters once we support
              // filtering search results
              searchKey={this.query()}
              // counts are inaccurate starting with the third term
              // in a venn diagram search
              showCount={this.props.activeQuery < 2}
              requestResults={this.props.requestResults}
              totalCount={this.props.totalResults}
              isFetching={this.props.isFetching}
            >
              { (results.length > 12 || allLocked || this.state.showAll || this.props.results.length !== this.visibleResults()) &&
              <SearchActions hasResults={results.length > 0 || allLocked}>
                { results.length > 0 && <Separator /> }
                {
                  allLocked
                    ? <p onClick={this.startSearch}>SEE RESULTS</p>
                    : !results.length
                      ? <NoResults createNode={this.props.createNode} query={this.query()} />
                      : (<p
                        className={showAll ? 'centered' : ''}
                        onClick={() => this.setState({ showAll: !showAll })}>
                        {showAll ? 'SEE TOP RESULTS' : 'SEE ALL RESULTS'}
                      </p>)
                }
                {
                  results.length > 0 &&
                  this.state.showAll &&
                  this.query().toLowerCase().trim() !== results[0].title.toLowerCase() &&
                    <NoResults createNode={this.props.createNode} query={this.query()} someResults />
                }
              </SearchActions>
              }
            </Results>
          }
          {
            this.props.loading && this.props.activeQuery > 0 &&
            <LoadingWrapper><p>Loading</p></LoadingWrapper>
          }
        </Flex>
      </SidebarMenu>
    )
  }
  documentKeyHandler = (e) => {
    if (this.props.panelVisible) {
      if (e.keyCode === keycodes.ENTER) {
        this.startSearch(this.selectedIndex())
      } else if (e.keyCode === keycodes.BACKSPACE) {
        const lastQuery = this.props.queries[this.props.queries.length - 1]
        const activeQuery = this.props.queries[this.props.activeQuery]
        const canRemoveLast = this.props.queries.length > 1 &&
          !(lastQuery.query.length > 0 &&
          lastQuery.id === null)
        const editingActive = activeQuery.id === null && activeQuery.query.length > 0

        // Only handle first keydown event when delete key is being held
        // According to MDN, this doesn't work in some Linux environments,
        // such as Ubuntu 9.4. https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
        if (this.deleteWasPressed) {
          return
        }

        this.deleteWasPressed = true

        if (canRemoveLast && !editingActive) {
          this.removeQuery(this.props.activeQuery)
          e.preventDefault()
        }
      }
    } else if (!this.props.overlayOpen) {
      if (e.keyCode === keycodes.SPACE) {
        e.preventDefault()
        this.props.open()
      } else if (this.props.fixedPathSingleNodeView.show && keycoder.eventToCharacter(e)) {
        this.props.open()
        this.props.updateQuery('', 0)
      }
    }
  }
  documentKeyUpHandler = (e) => {
    if (e.keyCode === keycodes.BACKSPACE) {
      this.deleteWasPressed = false
    }
  }
  componentWillMount () {
    document.addEventListener('keydown', this.documentKeyHandler)
    document.addEventListener('keyup', this.documentKeyUpHandler)
  }
  componentWillUnmount () {
    document.removeEventListener('keydown', this.documentKeyHandler)
    document.removeEventListener('keyup', this.documentKeyUpHandler)
  }
  componentDidUpdate () {
    if (this.focusQuery !== 'none') {
      let el = this.searchInputs[this.focusQuery]
      if (!el) {
        return
      }

      el.focus()

      el.selectionStart = this.selectAll ? 0 : 200
      el.selectionEnd = 200

      this.focusQuery = 'none'
      this.selectAll = false
    }
  }
  componentWillReceiveProps (props) {
    const selectedIndex = this.selectedIndex(
      this.visibleResults(props.results, props.tagFilters)
    )
    this.setState({
      selected: selectedIndex === 0 ? '' : this.state.selected,
    })

    if (props.results !== this.props.results) {
      this.filterCount.clear()
    }

    if (
      props.queries.length === 2 &&
      this.props.queries.length === 1
    ) {
      let index = this.selectedIndex()
      let selected = this.visibleResults()[index]

      if (!selected) {
        return
      }

      if (this.props.queries[0].query.toLowerCase() === selected.title.toLowerCase() || this.state.selected.length > 0) {
        setTimeout(() => this.startSearch(index, selected), 200)
      }
    }

    if (props.panelVisible !== this.props.panelVisible) {
      this.setState({
        showAll: false,
      })

      const unlockedQuery = this.props.queries.find(query => !query.id)

      if (unlockedQuery && unlockedQuery.query.length > 0) {
        this.selectAll = true
        this.focusQuery = this.props.queries.indexOf(unlockedQuery)
      }

      // When the single node view is open,
      // Default to only searching the focused node's children
      // After it is closed, we should reset to searching everything
      if (
        props.fixedPathSingleNodeView.show === true ||
        props.within === 'focused-related'
      ) {
        this.props.updateFrameReference(props.fixedPathSingleNodeView.show ? 'focused-related' : 'all-brane')
      }
    }
  }
}

const mapStateToProps = createStructuredSelector({
  tagFilters: selectTagFilters(),
  fixedPathSingleNodeView: selectSingleNodeView,
  results: selectResults(),
  within: selectFilterWithin(),
  queries: selectQueries(),
  activeQuery: selectActiveQuery(),
  vennDiagramSearch: selectVennDiagramSearch(),
  bothLocked: selectQueriesLocked(),
  menu: selectMenu,
  welcome: selectWelcome(),
  loading: selectLoading(),
  totalResults: selectTotalResults(),
  isFetching: selectFetching(),
  tagCounts: selectTagCounts(),
})

const mapDispatchToProps = {
  updateTagFilters: updateTagFilters,
  updateQuery,
  updateSelected,
  updateActiveQuery,
  addQuery,
  removeQuery,
  queriesLocked,
  search,
  startSearch,
  updateFrameReference,
  updateOperator,
  createNode: (title) => showNodeCreationWindow(null, title),
  requestResults: requestResults,
}

export default connect(mapStateToProps, mapDispatchToProps)(Search)
