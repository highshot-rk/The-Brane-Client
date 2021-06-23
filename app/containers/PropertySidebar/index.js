import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectStatistics, selectActiveProperties, selectQuery, selectAvailableFilteredProperties, selectFetching, selectPropertyNetworkError, selectExpandedProperty } from './selectors'
import {
  setSortDirection,
  activatePropertyFilter,
  deactivateProperty,
  queryChanged,
  expandProperty,
} from './actions'
import { SidebarMenu } from 'components/SideBarMenu'
import PropertySelector from 'components/PropertySelector'
import { Filler } from 'elements/layout'
import { PropertyTitle, PropertyTitleRow } from './elements'
import MinimalSearch from 'components/MinimalSearch'
import Statistics from 'components/Statistics'
import { createStructuredSelector } from 'reselect'
import { selectTagFilters } from 'containers/Search/selectors'
import ActiveProperties from 'components/ActiveProperties'
import { LinearProgress } from 'material-ui-core'

const PROPERTY_COLORS = [
  '#51E898',
  '#FF78CB',
  '#48b9e6',
  '#e6e45a',
]
let activatedCount = 0

export class PropertyFilters extends Component {
  static propTypes = {
    setSortDirection: PropTypes.func,
    statistics: PropTypes.array,
    query: PropTypes.string,
    isFetching: PropTypes.bool.isRequired,
    propertyNetworkError: PropTypes.bool,
    activeProperties: PropTypes.arrayOf(PropTypes.object),
    availableProperties: PropTypes.array,
    deactivateProperty: PropTypes.func,
    queryChanged: PropTypes.func,
    tagFilters: PropTypes.array,
    panelVisible: PropTypes.bool,
    open: PropTypes.func,
    expandProperty: PropTypes.func,
    expandedProperty: PropTypes.string,
    activatePropertyFilter: PropTypes.func,
  }
  findActiveStatistics () {
    const {
      statistics,
      activeProperties,
    } = this.props

    return statistics.filter(statistic => {
      return activeProperties.find(property => property.title === statistic.propertyTitle)
    })
  }
  activateProperty = (property) => {
    let color = PROPERTY_COLORS[activatedCount++ % PROPERTY_COLORS.length]

    this.props.activatePropertyFilter({
      ...property,
      color,
    })
  }
  clear = () => {
    this.props.activeProperties.forEach(property => {
      this.props.deactivateProperty(property._id)
    })
  }
  render () {
    const {
      availableProperties,
      activeProperties,
      deactivateProperty,
      query,
      queryChanged,
      setSortDirection,
      tagFilters,
      panelVisible,
      open,
      isFetching,
      propertyNetworkError,
      expandProperty,
      expandedProperty,
    } = this.props
    const isEmpty = () => {
      if (availableProperties.length === 0 && activeProperties.length === 0) {
        return true
      } else if (availableProperties.length >= 1) {
        return false
      } else if (activeProperties.length >= 1) {
        return false
      }
    }
    const completed = 100
    if (!panelVisible && activeProperties.length) {
      return <ActiveProperties
        activeProperties={activeProperties}
        open={open}
        clear={this.clear}
        tagFilters={tagFilters}
      />
    } else if (!panelVisible) {
      return null
    }

    return (
      <SidebarMenu width={'280px'}>
        <PropertyTitleRow>
          <PropertyTitle>Properties available:</PropertyTitle> {isFetching ? <div /> : (isEmpty()) ? <PropertyTitle>None</PropertyTitle> : <div />}
        </PropertyTitleRow>
        <MinimalSearch
          placeholder='Search'
          value={query}
          onChange={e => queryChanged(e.target.value)}
          icon
          wrappedBorder
        />

        {isEmpty()
          ? (propertyNetworkError) ? <div><LinearProgress variant='determinate' value={completed} color='secondary' /><PropertyTitle>Something is wrong. Please try again later</PropertyTitle></div>
            : (isFetching ? <div><LinearProgress /> <PropertyTitle>Searching properties...</PropertyTitle></div>
              : <div> <LinearProgress variant='determinate' value={completed} /><PropertyTitle>No properties available</PropertyTitle>
                <PropertySelector
                  active={activeProperties}
                  available={availableProperties}
                  activateProperty={this.activateProperty}
                  deactivateProperty={deactivateProperty}
                  setSortDirection={setSortDirection}
                  expandProperty={expandProperty}
                  expandedProperty={expandedProperty}
                /></div>)
          : <PropertySelector
            active={activeProperties}
            available={availableProperties}
            activateProperty={this.activateProperty}
            deactivateProperty={deactivateProperty}
            setSortDirection={setSortDirection}
            expandProperty={expandProperty}
            expandedProperty={expandedProperty}
          />
        }
        <Filler />
        {activeProperties.length
          ? <Statistics statistics={this.findActiveStatistics()} />
          : null
        }
      </SidebarMenu>
    )
  }
}

const mapDispatchToProps = {
  setSortDirection,
  activatePropertyFilter,
  deactivateProperty,
  queryChanged,
  expandProperty,
}

const mapStateToProps = createStructuredSelector({
  availableProperties: selectAvailableFilteredProperties(),
  activeProperties: selectActiveProperties(),
  statistics: selectStatistics(),
  query: selectQuery(),
  tagFilters: selectTagFilters(),
  isFetching: selectFetching(),
  propertyNetworkError: selectPropertyNetworkError(),
  expandedProperty: selectExpandedProperty(),
})

export default connect(mapStateToProps, mapDispatchToProps)(PropertyFilters)
