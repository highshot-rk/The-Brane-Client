import * as e from './elements'

import Overlay from 'components/Overlay'
import PropTypes from 'prop-types'
import React from 'react'
import { arrow } from './icons'

export default class DropDown extends React.Component {
  state = {
    expanded: false,
    selected: 0,
  }

  toggleExpanded = () => {
    this.setState({
      expanded: !this.state.expanded,
    })
  }
  selectOption = (i) => {
    this.props.onChange(this.props.options[i].value)
    this.setState({
      selected: -1,
    })
  }
  componentWillReceiveProps (newProps) {
    if (newProps.selected !== this.props.selected) {
      this.setState({
        selected: -1,
      })
    }
  }
  render () {
    if (this.state.selected === -1) {
      this.props.options.some((option, i) => {
        if (option.type !== 'section' && option.value === this.props.selected) {
          this.state.selected = i
          return true
        }
        return false
      })
    }

    return (
      <span>
        { this.state.expanded ? <Overlay onClose={this.toggleExpanded} /> : null }
        <e.Wrapper onClick={this.toggleExpanded} expanded={this.state.expanded}>
          <e.Label>{this.props.label}</e.Label>
          { !this.state.expanded ? <e.Selected>{this.props.options[this.state.selected].text}</e.Selected> : null }
          <e.Arrow expanded={this.state.expanded}>{arrow}</e.Arrow>
          {
            this.state.expanded &&
          (this.props.dropDown ? this.props.dropDown({ options: this.props.options, selectOption: this.selectOption }) : <e.Drop>
            {this.props.options.map((option, i) => {
              if (option.type === 'section') {
                return (
                  <e.Section first={i === 0} key={i} onClick={e => e.stopPropagation()}>{option.text}</e.Section>
                )
              } else {
                return (
                  <e.Option selected={i === this.state.selected} key={i} onClick={this.selectOption.bind(this, i)}>{option.text}</e.Option>
                )
              }
            })
            }
          </e.Drop>)
          }
        </e.Wrapper>
      </span>
    )
  }
}

DropDown.propTypes = {
  options: PropTypes.array,
  selected: PropTypes.string,
  label: PropTypes.string,
  onChange: PropTypes.func,
  dropDown: PropTypes.func,
}
