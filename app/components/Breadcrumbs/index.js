import PropTypes from 'prop-types'
import React, { Component } from 'react'
import {
  Wrapper,
} from './elements'

export default class Breadcrumbs extends Component {
  static propTypes = {
    crumbs: PropTypes.array,
    onClick: PropTypes.func,
  }
  render () {
    const {
      crumbs,
      onClick,
    } = this.props

    return <Wrapper>
      <svg onClick={() => onClick(crumbs[0]._key)} xmlns='http://www.w3.org/2000/svg' viewBox='-152 224 34.8 65.9' x='0px' y='0px'>
        <path fill='#646464' d='M-151.6 257.7l31.8 31.8c.6.6 1.5.6 2.1 0 .6-.6.6-1.5 0-2.1l-30.7-30.7 30-30c.6-.6.6-1.5 0-2.1-.6-.6-1.5-.6-2.1 0l-31.1 31.1c-.3.3-.4.7-.4 1.1 0 .2.1.6.4.9z' />
      </svg>
      {crumbs.map(({ _key, title }, index) =>
        <span onClick={() => onClick(_key)} key={_key}>{index !== 0 && '/'}{title}</span>
      )}
    </Wrapper>
  }
}
