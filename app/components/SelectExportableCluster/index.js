import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import {
  Wrapper,
  Check,
  UnCheck,
  Col,
  Cols,
  Colf,
  Row,
  Mark,
} from './element'

class CheckBox extends Component {
  static propTypes = {
    checked: PropTypes.bool,
    currentClusterNumber: PropTypes.number,
    currentTopicsNumber: PropTypes.number,
    currentName: PropTypes.string,
    specifyClusterNumber: PropTypes.number,
    specifyTopicsNumber: PropTypes.number,
    specifyNumber: PropTypes.number,
  }
  checkset = (name) => {
    this.props.submit(name)
  }
  render () {
    const {
      checked,
      currentClusterNumber,
      currentTopicsNumber,
      currentName,
      specifyClusterNumber,
      specifyTopicsNumber,
      specifyNumber,
    } = this.props
    return (
      <Wrapper>
        <Row margin={'10px'}>
          {
            checked === 'current' ? (<Check><Mark>✓</Mark></Check>) : (<UnCheck onClick={() => this.checkset('current')} />)
          }
          <div style={{ marginLeft: '13px' }}>Current Node</div>
          <Colf>{currentName}({currentClusterNumber} clusters, {currentTopicsNumber} related topics)</Colf>
        </Row>
        <Row margin={'10px'}>
          {
            checked === 'all' ? (<Check><Mark>✓</Mark></Check>) : (<UnCheck onClick={() => this.checkset('all')} />)
          }
          <div style={{ marginLeft: '13px' }}>Whole path</div>
          <Cols>{specifyNumber} paths ({specifyClusterNumber} clusters, {specifyTopicsNumber} related topics)</Cols>
        </Row>
        <Row margin={'10px'}>
          {
            checked === 'specify' ? (<Check><Mark>✓</Mark></Check>) : (<UnCheck onClick={() => this.checkset('specify')} />)
          }
          <div style={{ marginLeft: '13px' }}>Specify node(s)</div>
          <Col>Up to {specifyNumber} nodes ({specifyClusterNumber} clusters, {specifyTopicsNumber} related topics)</Col>
        </Row>
      </Wrapper>
    )
  }
}

export default CheckBox
