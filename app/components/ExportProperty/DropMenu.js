import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Menu,
  Row,
  CirclePlus,
  CircleMin,
  Mark,
  Span,
} from './element'

export default class DropMenu extends Component {
  static propTypes = {
    allCluster: PropTypes.object.isRequired,
    selectedCluster: PropTypes.object.isRequired,
    searchtext: PropTypes.string,
    allClusterKey: PropTypes.array,
    metapropertytoggle: PropTypes.func,
    allClusterstoggle: PropTypes.func,
  }

  render () {
    const {
      allCluster,
      selectedCluster,
      searchtext,
      metapropertytoggle,
      allClusterstoggle,
      allClusterKey,
    } = this.props

    let allClusterSelect = {}
    Object.values(allCluster)[0].metaData.forEach((val) => {
      if ((val.indexOf(searchtext) !== -1) && (!!searchtext)) {
        allClusterSelect[val] = false
        let sum = 0
        allClusterKey.forEach((each) => {
          if (selectedCluster[each].metaData.includes(val)) {
            sum++
          }
        })
        if (sum === allClusterKey.length) {
          allClusterSelect[val] = true
        }
      }
    })
    return (
      <Menu>
        {
          Object.values(allCluster)[0].metaData.map((val, key) => (
            (val.indexOf(searchtext) !== -1) && (!!searchtext) && (
              <div key={key}>
                <Row>
                  {
                    (allClusterSelect[val]) ? (<CirclePlus onClick={() => allClusterstoggle(val, false)}><Mark>✓</Mark></CirclePlus>) : (<CircleMin onClick={() => allClusterstoggle(val, true)}><Span>+</Span></CircleMin>)
                  }
                  <div>All Clusters/{val}</div>
                </Row>
                {
                  allClusterKey.map((each, index) => (
                    <Row key={index} style={{ marginLeft: '10px' }}>
                      {
                        (!allClusterSelect[val] && selectedCluster[each].metaData.includes(val)) ? (<CirclePlus onClick={() => metapropertytoggle(val, each, false)}><Mark>✓</Mark></CirclePlus>) : (<CircleMin onClick={() => metapropertytoggle(val, each, true)}><Span>+</Span></CircleMin>)
                      }
                      <div>
                        {allCluster[each].title}/{val}
                      </div>
                    </Row>
                  ))}
              </div>
            )
          )
          )
        }
      </Menu>
    )
  }
}
