import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as e from './elements'
import Property from './Property'
import PropertyDetails from 'containers/PropertyDetails'

const propertiesShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
})

export default class PropertySelector extends Component {
  static propTypes = {
    active: PropTypes.arrayOf(propertiesShape),
    available: PropTypes.arrayOf(propertiesShape),
    selected: PropTypes.string,
    activateProperty: PropTypes.func,
    deactivateProperty: PropTypes.func,
    setSortDirection: PropTypes.func,
    expandProperty: PropTypes.func,
    expandedProperty: PropTypes.string,
  }

  activateCluster = (properties) => {
    properties.forEach(property => {
      this.props.activateProperty(property)
    })
  }

  deactivateCluster = (properties) => {
    properties.forEach(property => {
      this.props.deactivateProperty(property._id, property.cluster)
    })
  }

  groupByCluster = (properties) => {
    return properties.reduce((result, property) => {
      result[property.cluster] = result[property.cluster] || []
      result[property.cluster].push(property)

      return result
    }, {})
  }

  render () {
    const {
      active,
      available: all,
      activateProperty,
      deactivateProperty,
      setSortDirection,
      expandProperty,
      expandedProperty,
    } = this.props

    const available = all.filter(property =>
      !active.find(active => active._id === property._id)
    )

    const availableByCluster = this.groupByCluster(available)
    const activeByCluster = this.groupByCluster(active)

    return (
      <>
        {
          active.length > 0 &&
          <e.Section>
            <e.Title>Active: {active.length}</e.Title>
            <e.List>
              {Object.keys(activeByCluster).map(clusterName => (
                <>
                  <Property
                    isCluster
                    onClick={() => this.deactivateCluster(activeByCluster[clusterName])}
                    active
                    title={clusterName}
                  />
                  {
                    activeByCluster[clusterName].map(property => {
                      const expanded = expandedProperty === property._id
                      return (
                        <>
                          <Property
                            active
                            onClick={() => deactivateProperty(property._id)}
                            onToggleSortDirection={(sortDirection) => setSortDirection(property._id, sortDirection)}
                            onTitleClick={() => expandProperty(expanded ? null : property._id)}
                            expanded={expanded}
                            {...property}
                          />
                          {expanded && <PropertyDetails id={property._id} />}
                        </>
                      )
                    }
                    )}
                </>
              ))}
            </e.List>
          </e.Section>
        }
        {
          available.length > 0 &&
          <e.Section>
            <e.Title>All: {available.length}</e.Title>
            <e.List>
              {Object.keys(availableByCluster).map(clusterName => <>
                <Property isCluster onClick={() => this.activateCluster(availableByCluster[clusterName])} title={clusterName} />
                {availableByCluster[clusterName].map(property => {
                  const clickHandler = () => activateProperty(property)

                  return <Property onClick={clickHandler} onTitleClick={clickHandler} {...property} />
                })}
              </>
              )}
            </e.List>
          </e.Section>
        }
      </>
    )
  }
}
