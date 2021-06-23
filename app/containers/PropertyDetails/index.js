import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { selectPropertyValues, selectSelectedValues } from 'containers/PropertySidebar/selectors'
import {
  setSortDirection,
  activatePropertyFilter,
  deactivateProperty,
  queryChanged,
  setSelectedValues,
} from '../PropertySidebar/actions'
import { Container, SectionTitle, ValueList, SelectAll } from './elements'
import { MiniCheckbox } from 'elements/form'

export class PropertyDetails extends Component {
  static propTypes = {
    values: PropTypes.arrayOf(PropTypes.string),
    selectedValues: PropTypes.arrayOf(PropTypes.string),
    setSelectedValues: PropTypes.func,
    id: PropTypes.string,
  }
  allSelected = () => {
    const {
      values,
      selectedValues,
    } = this.props

    return values.every(value => selectedValues.includes(value))
  }
  toggleAll = () => {
    if (this.allSelected()) {
      this.props.setSelectedValues(this.props.id, [])
    } else {
      this.props.setSelectedValues(this.props.id, this.props.values)
    }
  }
  toggleValue = (value) => {
    if (this.props.selectedValues.includes(value)) {
      this.props.setSelectedValues(this.props.id, this.props.selectedValues.filter(_value => value !== _value))
    } else {
      this.props.setSelectedValues(this.props.id, [...this.props.selectedValues, value])
    }
  }
  render () {
    const {
      values,
      selectedValues,
    } = this.props

    const allSelected = values.every(value => selectedValues.includes(value))

    return (
      <Container>
        <SectionTitle>Filter by</SectionTitle>
        <SelectAll>
          <MiniCheckbox onChange={this.toggleAll} type='checkbox' checked={allSelected} /> All
        </SelectAll>
        <ValueList>
          {values.map(value => (
            <label key={value}>
              <MiniCheckbox type='checkbox' onChange={() => this.toggleValue(value)} checked={selectedValues.includes(value)} /> {value}
            </label>
          ))}
        </ValueList>
      </Container>
    )
  }
}

const mapDispatchToProps = {
  setSortDirection,
  activatePropertyFilter,
  deactivateProperty,
  queryChanged,
  setSelectedValues,
}

const mapStateToProps = function () {
  return function (state, props) {
    return {
      values: selectPropertyValues()(state, props),
      selectedValues: selectSelectedValues()(state, props),
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PropertyDetails)
