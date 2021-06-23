import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as e from './elements'
import { BoldTitle } from 'elements/layout'
import { BoldSeperator, Tab } from 'elements/components'
import { prepareKey } from 'components/PropertySelector/utils'
import { mean, median, stdPopulation } from 'utils/math'

const DAY_MS = 1000 * 60 * 60 * 24

export default class Statistics extends Component {
  static propTypes = {
    statistics: PropTypes.array,
  }
  state = {
    selectedProperty: null,
  }
  prepareValue (value) {
    if (typeof value === 'object' && value instanceof Date) {
      return value.toLocaleDateString('en-US', {
        day: '2-digit',
        year: '2-digit',
        month: '2-digit',
      })
    }
    let decimalPlaces = 4

    if (Math.abs(value) > 1000) {
      decimalPlaces = 2
    }

    const adjustBy = Math.pow(10, decimalPlaces)
    return Math.floor(value * adjustBy) / adjustBy
  }
  stringStats = (values) => {
    const total = values.length
    const grouped = values.reduce((result, value) => {
      result[value] = result[value] || 0
      result[value] += 1

      return result
    }, {})

    return Object.entries(grouped).map(([name, count]) => {
      return <tr key={name}>
        <td>{name}</td>
        <td>{this.prepareValue(count)}</td>
        <td>{Math.floor(count / total * 100)}%</td>
      </tr>
    }).concat([
      <tr key={'total'} style={{ fontWeight: 'bold' }}>
        <td>Total</td>
        <td>{total}</td>
        <td>100%</td>
      </tr>,
    ])
  }
  dateStats = (values) => {
    const now = Date.now()
    const parsedValues = values.map(value => new Date(value.value)).sort((a, b) => a.getTime() - b.getTime())
    const asDays = parsedValues.map(date => {
      return (now - date.getTime()) / DAY_MS
    })
    const earliest = parsedValues[0]
    const latest = parsedValues[parsedValues.length - 1]
    const stats = {
      'Oldest': earliest,
      'Newest': latest,
      'Range (days)': asDays[0] - asDays[asDays.length - 1],
      'Mean (days)': mean(asDays),
      'Median (days': median(asDays),
      'STD (days)': stdPopulation(asDays),
      n: values.length,
    }

    return Object.entries(stats).map(([name, value]) => {
      return (
        <tr key={name}>
          <td>{name}</td>
          <td>{this.prepareValue(value)}</td>
        </tr>
      )
    })
  }
  numberStats = (stats) => {
    return Object.entries(stats)
      .map(([key, value]) => (
        <tr>
          <td>{prepareKey(key)}</td>
          <td>{this.prepareValue(value)}</td>
        </tr>
      ))
  }
  prepareStats = () => {
    const {
      statistics,
    } = this.props

    const {
      // propertyId and topicId isn't used
      // but we want to get it out of stats
      propertyId,
      topicId,
      values,
      propertyTitle,
      ...stats
    } = statistics.find(property => property.propertyTitle === this.state.selectedProperty) || statistics[0] || {}
    let type = 'number'
    let statsRows
    if (values && typeof values[0] === 'string') {
      statsRows = this.stringStats(values)
      type = 'string'
    } else if (values && values[0]._type === 'date') {
      statsRows = this.dateStats(values)
      type = 'date'
    } else {
      statsRows = this.numberStats(stats)
    }

    return {
      statsRows,
      propertyTitle,
      type,
    }
  }

  render () {
    const {
      statistics,
    } = this.props

    const {
      propertyTitle,
      statsRows,
    } = this.prepareStats()

    return (
      <>
        <BoldTitle>Statistics</BoldTitle>
        <BoldSeperator />
        {statistics.length > 0 && <e.Tabs>
          {statistics.map((statistic) =>
            <Tab
              selected={statistic.propertyTitle === propertyTitle}
              onClick={() => this.setState({ selectedProperty: statistic.propertyTitle })}
            >
              {statistic.propertyTitle}
            </Tab>
          )}
        </e.Tabs>}
        <e.StatsTable>
          {
            statsRows
          }
        </e.StatsTable>
      </>
    )
  }
}
