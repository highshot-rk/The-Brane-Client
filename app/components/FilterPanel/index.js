import {
  Separator,
  Clear,
  Section,
  Search,
  BreadCrumbs,
  AutoFilter,
} from './elements'
import {
  tagTree,
} from 'utils/filter-tags'

import Accordion from 'components/Accordion'
import DropDown from 'components/DropDown'
import Switch from 'components/Switch'
import Wrapper from './Wrapper'
import PropTypes from 'prop-types'
import React from 'react'
import { ARROW_DOWN, ARROW_UP, ENTER } from 'utils/key-codes'
import {
  findTagFilterIndex,
  clusterKeyToTagPath,
  keyToTree,
  allUniqueTags,
  tagPathsInclude,
} from 'utils/tags'
import BreadcrumbMenu from '../Breadcrumbs'
import { walkTagTree } from 'utils/tree'
/**
 * MAX_VISIBLE_LEVELS
 * This represents the max of levels to show in the filter tree menu:
 * node 1 <== level 0
 *   child node 1 <== level 1
 *    child child node 1 <== level 2
 * *    child child child node 1 <== level 3
 * if the levels is > MAX_VISIBLE_LEVELS the first levels
 * (levels - MAX_VISIBLE_LEVELS)
 * should hide from the visible tree
 * * *  ...
 */
const MAX_VISIBLE_LEVELS = 2
const FilterWithinOptions = [
  // TODO: rename children to relatives
  {
    value: 'current-children',
    text: 'Current Node',
  },
  {
    value: 'all-children',
    text: 'Path',
  },
]

const ShowOptions = [
  {
    value: 'all',
    text: 'All Related Nodes',
  },
  {
    value: 'children',
    text: 'Only Children',
  },
  {
    value: 'parents',
    text: 'Only Parents',
  },
]

export default class FilterPanel extends React.Component {
  static propTypes = {
    tagFilters: PropTypes.array.isRequired,
    updateTagFilters: PropTypes.func.isRequired,
    getCount: PropTypes.func.isRequired,
    updateFrameReference: PropTypes.func,
    updateShowOnOrbit: PropTypes.func,
    clear: PropTypes.func,
    within: PropTypes.string,
    showOnOrbit: PropTypes.string,
    searchText: PropTypes.string,
    isSidebarMenu: PropTypes.bool,
    hideDropDown: PropTypes.bool,
    condensed: PropTypes.bool,
    advanced: PropTypes.bool,
    vennSearch: PropTypes.bool,
    keyboardEvents: PropTypes.array,
    tagTree: PropTypes.object,
    autoFilter: PropTypes.bool,
    toggleAutoFilter: PropTypes.func,
  }
  state = {
    search: '',
    opened: {},
    selected: null,
  }

  updateSearch = (e) => {
    this.setState({
      search: e.target.value,
    })
  }
  searchText = () => {
    if (typeof this.props.searchText === 'string') {
      return this.props.searchText
    } else {
      return this.state.search
    }
  }

  toggleOpen = (tagKey, forcedPosition) => {
    const tag = keyToTree(tagKey)

    // If it has no children, select/deselect it instead
    if (tag.children.length === 0) {
      const selected = !this.isTagChecked(tagKey)
      this.onSelect(tagKey, selected)
      return
    }

    const opened = this.state.opened
    const willOpen = typeof forcedPosition === 'boolean' ? forcedPosition : !opened[tagKey]

    this.setState({
      opened: {
        ...opened,
        [tagKey]: willOpen,
      },
    })
  }
  /**
   * Finds situations where there is only one available sub-cluster
   * This is used to auto-select the type when a family or group is selected
   */
  getLastSingleOption = (tag) => {
    const enabledChildren = tag.children.filter(child => {
      return this.props.getCount(clusterKeyToTagPath(child._key)) > 0
    })

    if (enabledChildren.length === 1) {
      return enabledChildren[0]
    }

    return null
  }

  addTagFilters = (tag) => {
    const path = clusterKeyToTagPath(tag._key)
    const tagFilters = this.props.tagFilters
      .slice()
      .filter((_path) => {
        // remove all children tag filters since
        // they are included in the new filter
        return !tagPathsInclude(path, _path)
      })

    if (!this.isTagChecked(tag._key)) {
      tagFilters.push(path)
    }

    if (path.length > 1) {
      path.slice(0, path.length - 1).find((item) => {
        // Check if all of the parent's children are selected
        // If they are, then we can add the parent as a tag filter
        // and remove the children
        const parentTag = keyToTree(item._key)
        let unselected = false
        let selected = []

        walkTagTree(parentTag.children, child => {
          unselected = unselected || !this.isTagChecked(child._key, tagFilters)
          if (!unselected) {
            selected.push(child)
          }
        })

        if (!unselected) {
          selected.forEach(tag => {
            tagFilters.splice(tagFilters.findIndex(tagFilter => tagFilter[tagFilter.length - 1]._key === tag._key), 1)
          })
          tagFilters.push(clusterKeyToTagPath(parentTag._key))

          // No reason to go any further since we know they are all selected
          return true
        }
      })
    }

    this.props.updateTagFilters(tagFilters)
  }
  removeTagFilters = (path) => {
    const tagFilters = this.props.tagFilters.slice()

    // Remove all children tags
    while (findTagFilterIndex(tagFilters, path) > -1) {
      const index = findTagFilterIndex(tagFilters, path)
      tagFilters.splice(index, 1)
    }

    if (path.length > 1) {
      const toRemove = path.map(cluster => cluster._key)

      path.slice(0, path.length - 1).forEach((item, index) => {
        // Remove all parent tags since they are only valid when all of their children
        // are selected, and add sibling tags
        const parentIndex = findTagFilterIndex(tagFilters, path.slice(0, index + 1), true)

        if (parentIndex > -1) {
          tagFilters.splice(parentIndex, 1)
          keyToTree(item._key).children.filter(
            child => !toRemove.includes(child._key)
          ).forEach(tag => tagFilters.push(clusterKeyToTagPath(tag._key)))
        }
      })
    }

    this.props.updateTagFilters(tagFilters)
  }
  onSelect = (tagKey, checked) => {
    const tag = keyToTree(tagKey)
    const lastItemOnBranch = this.getLastSingleOption(tag)
    let path = clusterKeyToTagPath(tag._key)
    // When only one of it's children is enabled, automatically select it
    if (lastItemOnBranch && checked) {
      path = clusterKeyToTagPath(lastItemOnBranch._key)
    }

    if (checked && tag.children.length) {
      this.toggleOpen(tag._key, true)
    }

    if (checked) {
      this.addTagFilters(tag)
    } else {
      this.removeTagFilters(path)
    }
  }
  /**
   * Returns if the tag or it's parent is checked
   */
  isTagChecked (tagKey, tagFilters) {
    tagFilters = tagFilters || this.props.tagFilters
    const tagPath = clusterKeyToTagPath(tagKey)
    const parentFilters = tagPath.reduce((result, _value, index) => {
      result.push(tagPath.slice(0, index + 1))
      return result
    }, [])

    return !!tagFilters.find(tagFilter =>
      parentFilters.find(filter =>
        filter[filter.length - 1]._key === tagFilter[tagFilter.length - 1]._key
      ))
  }
  getVisibleTags (items) {
    const tags = []
    const searching = this.searchText().length > 0

    items.sort((tag1, tag2) => {
      const count1 = this.props.getCount(clusterKeyToTagPath(tag1._key))
      const count2 = this.props.getCount(clusterKeyToTagPath(tag2._key))

      return count2 - count1
    })
      .forEach(tag => {
        if (searching && !tag.title.toLowerCase().includes(this.searchText())) {
          return
        }

        tags.push(tag)

        if (searching || this.state.opened[tag._key]) {
          tags.push(
            ...this.getVisibleTags(tag.children)
          )
        }
      })

    return tags
  }
  onBreadcrumbClicked = (tagKey) => {
    const tagPath = clusterKeyToTagPath(tagKey)
    const topParentTag = keyToTree(tagPath[0]._key)
    const levelsToKeep = tagPath.length + MAX_VISIBLE_LEVELS - 1
    let toClose = {}

    walkTagTree(topParentTag.children, (tag, path) => {
      if (path.length > levelsToKeep - 1 && this.state.opened[tag._key]) {
        toClose[tag._key] = false
      }
    })

    this.setState({
      opened: {
        ...this.state.opened,
        ...toClose,
      },
    })
  }
  deepestExpandedChild = (tag) => {
    let deepestExpanded = []

    walkTagTree(tag.children, (_tag, tagPath) => {
      if (this.state.opened[tagPath[tagPath.length - 1]._key]) {
        if (tagPath.length > deepestExpanded.length) {
          deepestExpanded = tagPath
        }
      }
    })

    return [tag, ...deepestExpanded]
  }
  accordionInfo = (tag, depth) => {
    const info = {
      parent: tag,
      count: this.props.getCount(clusterKeyToTagPath(tag._key)),
    }

    if (depth === 0 && this.deepestExpandedChild(tag).length > MAX_VISIBLE_LEVELS) {
      info.deepest = this.deepestExpandedChild(tag)
    }

    return info
  }
  isChildrenChecked = (children) => {
    return !!children.some(child => this.isTagChecked(child._key) || (child.children && this.isChildrenChecked(child.children)))
  }
  renderAccordion (tag, count, depth, parentOpened) {
    const searching = this.searchText().length > 0
    const subAccordion = depth > 0
    const countText = this.props.condensed ? '' : `(${count})`
    const checked = this.isTagChecked(tag._key)
    const showCheckbox = this.props.advanced || tag.children.length === 0 || !this.props.condensed
    const highlight = this.state.selected === tag._key
    const opened = searching || this.state.opened[tag._key]
    const renderChildren = parentOpened && tag.children

    return (
      <Accordion
        open={opened}
        toggleOpen={this.toggleOpen}
        showCheckbox={showCheckbox}
        title={tag.title}
        smallTitle={countText}
        subAccordion={subAccordion}
        name={tag._key}
        onChecked={this.onSelect}
        checked={checked}
        condensed={this.props.advanced ? false : this.props.condensed}
        highlight={highlight}
        disabled={count === 0}
        indeterminate={!checked && tag.children && this.isChildrenChecked(tag.children)}
      >
        {renderChildren && this.renderAccordions(tag.children, depth + 1, opened)}
      </Accordion>
    )
  }
  renderDeeplyExpanded = (deepest) => {
    const inBreadcrumbs = deepest.slice(0, deepest.length - MAX_VISIBLE_LEVELS)
    const topLevel = deepest[deepest.length - MAX_VISIBLE_LEVELS - 1]
    const topLevelTags = keyToTree(topLevel._key).children

    return (
      <>
        <BreadCrumbs>
          <BreadcrumbMenu onClick={this.onBreadcrumbClicked} crumbs={inBreadcrumbs} />
        </BreadCrumbs>
        {this.renderAccordions(topLevelTags, 0, true)}
      </>
    )
  }
  renderAccordions = (parentTags, depth = 0, nested, parentRendered = true) => {
    return this.filterTagLevel(parentTags)
      .map(parent => this.accordionInfo(parent, depth))
      .filter(parent => parent.count > 0)
      .sort((a, b) => {
        return b.count - a.count
      })
      .map(({ parent, count, deepest }) => {
        return <React.Fragment key={parent._key}>
          {deepest ? this.renderDeeplyExpanded(deepest) : this.renderAccordion(parent, count, depth, parentRendered)}
          {!nested && depth === 0 && !this.props.condensed ? <Separator /> : null}
        </React.Fragment>
      })
  }

  filterTagLevel = (tags) => {
    const query = this.searchText().toLowerCase()

    if (query.length === 0) {
      return tags
    }

    return tags.filter(tag => {
      return tag.title.toLowerCase().includes(query) ||
        (tag.children.length && this.filterTagLevel(tag.children).length)
    })
  }

  tagTree = () => (this.props.tagTree || tagTree).slice()

  render () {
    let dropdownsShown = !this.props.hideDropDown && !this.props.condensed
    let searchShown = !this.props.condensed

    let filterCount = this.props.condensed ? 0 : allUniqueTags(this.props.tagFilters).length

    let filterWithin = FilterWithinOptions.slice()
    if (this.props.vennSearch) {
      filterWithin.unshift({
        value: 'venn-search',
        text: 'Current Venn diagram search results',
      })
    }

    return (
      <Wrapper sidebarMenu={this.props.isSidebarMenu} condensed={this.props.condensed} >
        { dropdownsShown && <DropDown label='Filter Within' options={filterWithin} selected={this.props.within} onChange={this.props.updateFrameReference} /> }
        { dropdownsShown && <DropDown label='Show' options={ShowOptions} selected={this.props.showOnOrbit} onChange={this.props.updateShowOnOrbit} /> }
        {filterCount > 0
          ? <Clear onClick={this.props.clear}>
            <span>&times;</span>
            Clear all filters
            <div>({filterCount})</div>
          </Clear> : null
        }
        {
          this.props.isSidebarMenu && <AutoFilter>
            <span>Autofilter</span>
            <Switch
              onChange={this.props.toggleAutoFilter}
              checked={this.props.autoFilter}
            />
          </AutoFilter>
        }
        { searchShown &&
          <Section>
            <Search type='search' value={this.searchText()} onChange={this.updateSearch} placeholder='Search tags' />
          </Section>
        }
        { searchShown && <Separator /> }
        { this.renderAccordions(this.tagTree()) }
      </Wrapper>
    )
  }
  componentWillReceiveProps = (newProps) => {
    if (
      this.props.keyboardEvents &&
      newProps.keyboardEvents.length > this.props.keyboardEvents.length
    ) {
      newProps.keyboardEvents.slice(this.props.keyboardEvents.length).forEach(keyCode => {
        const visibleTags = this.getVisibleTags(this.tagTree())
        const selectedIndex = visibleTags.findIndex(tag => tag._key === this.state.selected)

        switch (keyCode) {
          case ARROW_DOWN:
            this.setState({
              selected: visibleTags[(selectedIndex + 1) % visibleTags.length || 0]._key,
            })
            break
          case ARROW_UP:
            this.setState({
              selected: visibleTags[selectedIndex - 1 < 0 ? visibleTags.length - 1 : selectedIndex - 1]._key,
            })
            break
          case ENTER:
            this.toggleOpen(this.state.selected)

          // no default
        }
      })
    }
  }
}
