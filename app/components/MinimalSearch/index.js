import React, { Component } from 'react'
import styled from 'styled-components'
import Icon from 'components/Icon'
import PropTypes from 'prop-types'

const Search = styled.input`
  /* Overriding styles from typography.scss */
  padding: 5px !important;
  padding-left: ${props => props.icon ? 0 : '5px'} !important;
  outline: none;
  height: auto;
`

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  ${
  props => props.borderSides.map(side => (
    `border-${side}: 1px solid ${props.fadedBorder ? '#E7E7E7' : '#979797'};`
  )).join('')
}

  svg {
    margin: 0 12px;
    opacity: 0.4;
  }
`

export default class MinimalSearch extends Component {
  static propTypes = {
    icon: PropTypes.bool,
    wrappedBorder: PropTypes.bool,
  }

  input = null
  render () {
    const {
      icon,
      wrappedBorder,
      ...inputProps
    } = this.props

    return (
      <Wrapper fadedBorder={wrappedBorder} borderSides={wrappedBorder ? ['bottom', 'top'] : ['bottom']}>
        { icon && <Icon name='search' width={20} height={20} /> }
        <Search icon={icon} type='search' {...inputProps} />
      </Wrapper>
    )
  }
}
