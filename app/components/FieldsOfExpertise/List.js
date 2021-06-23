import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Arrow from './icons/Arrow'
import {
  ListOption,
} from './elements'

export default class List extends Component {
  static propTypes = {
    results: PropTypes.array,
    isSearch: PropTypes.bool,
    onAddToPath: PropTypes.func,
    onAddSubject: PropTypes.func,
    isSelected: PropTypes.func,
  }

  render () {
    const {
      results,
      isSearch,
      onAddToPath,
      onAddSubject,
      isSelected,
    } = this.props

    return (
      <div>
        { results.map(cluster => {
          const isCluster = cluster.cl !== false
          const addToPath = () => onAddToPath(cluster)
          const addSubject = () => onAddSubject(cluster)

          return (
            <ListOption
              key={cluster._key}
              onClick={isSearch ? null : addSubject}
            >
              {isSelected(cluster._key)
                ? <button onClick={addSubject} style={{ background: '#18B7D8' }}>✓</button>
                : <button onClick={addSubject} style={{ background: '#9B9B9B' }} >+</button>
              }
              <span onClick={isCluster && !isSearch ? addToPath : addSubject}>{cluster.title}</span>
              {
                isCluster && !isSearch && <Arrow onClick={addToPath} />
              }
            </ListOption>
          )
        })
        }
      </div>
    )
  }
}
