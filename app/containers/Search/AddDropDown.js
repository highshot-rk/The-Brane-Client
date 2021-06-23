import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { AddQuery } from './elements'
import differenceIcon from './icons/difference.svg'
import intersectIcon from './icons/intersect.svg'
import unionIcon from './icons/union.svg'
import subtractionIcon from './icons/subtraction.svg'
import Overlay from 'components/Overlay'
import { featureEnabled } from 'utils/features'
import Icon from 'components/Icon'

export default class AddDropDown extends Component {
  static propTypes = {
    addQuery: PropTypes.func,
    toggleExpanded: PropTypes.func,
    expanded: PropTypes.bool,
    selected: PropTypes.string,
    onRemove: PropTypes.func,
  }
  vennSearch = featureEnabled('vennSearch')

  toggleExpanded = () => {
    if (!this.vennSearch) {
      return
    }

    this.props.toggleExpanded(!this.props.expanded)
  }
  addQuery = (type) => {
    this.props.addQuery(type)
    this.props.toggleExpanded(false)
  }
  render () {
    return (
      <AddQuery expanded={this.props.expanded}>
        {this.props.expanded && <Overlay transparent onClose={this.toggleExpanded} />}
        <div className='toggle' onClick={this.toggleExpanded}>
          {
            this.props.selected ? <div className='toggle-ui selected'>{this.props.selected}</div>
              : (
                <div className='toggle-ui'>
                  <Icon width={26} height={26} name='search' />
                  {this.vennSearch &&
                    <svg className='icon-arrow'>
                      <path d='M6.984 9.984h10.031l-5.016 5.016z' />
                    </svg>
                  }
                </div>
              )
          }
        </div>
        <div className={`suggestions ${this.props.expanded ? 'expanded' : ''}`}>
          {
            this.props.selected && [
              <div className='clear' onClick={this.props.onRemove}>
                Clear <strong>&#10006;</strong>
              </div>,
              <div className='separator' />,
            ]
          }
          <div className='suggestion' onClick={this.addQuery.bind(this, 'intersection')}>
            <span>&cap;</span> Intersection <img src={intersectIcon} alt='' />
          </div>
          <div className='suggestion' onClick={this.addQuery.bind(this, 'union')}>
            <span>&cup;</span> Union <img src={unionIcon} alt='' />
          </div>
          <div className='suggestion' onClick={this.addQuery.bind(this, 'difference')}>
            <span>&#x2206;</span> Difference <img src={differenceIcon} alt='' />
          </div>
          <div className='suggestion' onClick={this.addQuery.bind(this, 'subtraction')}>
            <span>-</span> Subtraction <img src={subtractionIcon} alt='' />
          </div>
        </div>
      </AddQuery>
    )
  }
}
