import React, { PureComponent } from 'react'

import Icon from 'components/Icon'
import { ClusterIcon } from '../Node/icons'
import PropTypes from 'prop-types'

import {
  HistoryItemWrapper,
  RootIcon,
  HistoryNode,
  IconWrapper,
} from './elements'

export default class HistoryItem extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    id: PropTypes.string,
    handleClick: PropTypes.func,
    active: PropTypes.bool,
    linked: PropTypes.bool,
    title: PropTypes.string,
    pathIndex: PropTypes.number,
  }
  clickHandler = () => {
    const {
      pathIndex,
      id,
      handleClick,
    } = this.props

    handleClick(pathIndex, id)
  }
  render () {
    const { type, active, linked, title } = this.props
    if (type === 'root') {
      return (
        <HistoryItemWrapper onClick={this.clickHandler} id={active ? 'active' : null}>
          <RootIcon>
            <Icon name='brane' width={24} height={24} />
          </RootIcon>
          <HistoryNode active={active} linked={linked} root><div className='title'>{title}</div></HistoryNode>
        </HistoryItemWrapper>
      )
    } else if (type === 'cluster') {
      return (
        <HistoryItemWrapper onClick={this.clickHandler} id={active ? 'active' : null}>
          <RootIcon>
            <ClusterIcon bgFill={active ? '#fff' : '#2D2D2D'} fill={active ? '#2D2D2D' : '#fff'} r={8} />
          </RootIcon>
          <HistoryNode active={active} linked={linked} root><div className='title'>{title}</div></HistoryNode>
        </HistoryItemWrapper>
      )
    } else if (type === 'search') {
      return (
        <HistoryItemWrapper onClick={this.clickHandler} id={active ? 'active' : null}>
          <IconWrapper visible={false} viewBox='0 0 120 120'>
            <path fill='#ACACAC' fillRule='evenodd' d='M31.9086516,53.0070659 C31.9086516,41.3245196 41.5321255,31.8501445 53.4034043,31.8501445 C65.2746831,31.8501445 74.9000443,41.3245196 74.9000443,53.0070659 C74.9000443,64.6896122 65.2746831,74.1451141 53.4034043,74.1451141 C41.5321255,74.1451141 31.9086516,64.6896122 31.9086516,53.0070659 Z M72.2181545,69.7476451 C76.30044,65.3124296 78.8068086,59.4617199 78.8068086,53.0070659 C78.8068086,39.1918416 67.4337838,28 53.4034043,28 C39.3730248,28 28,39.1918416 28,53.0070659 C28,66.803417 39.3730248,77.9952585 53.4034043,77.9952585 C59.4654945,77.9952585 65.0255561,75.900327 69.3928279,72.4087744 L88.6670443,91.4319765 C89.4295239,92.1869068 90.6657222,92.1869068 91.4282018,91.4319765 C92.1925688,90.6959195 92.1925688,89.4691577 91.4282018,88.7142274 L72.2181545,69.7476451 Z' />
          </IconWrapper>
          <HistoryNode active={active} linked={linked}><div className='title'>{title}</div></HistoryNode>
        </HistoryItemWrapper>
      )
    } else if (type === 'filter') {
      return (
        <HistoryItemWrapper onClick={this.clickHandler} id={active ? 'active' : null}>
          <IconWrapper visible={false} viewBox='0 0 120 120'>
            <path fill='#ACACAC' d='M84.2361424,36.9308932 L66.0192134,55.1730635 L65.5806419,55.6122711 L65.5806419,83.6363642 C65.5806419,84.071804 65.4565797,84.2597599 65.0422794,84.4406138 C64.9496125,84.4747574 64.8235813,84.5 64.7204264,84.5 C64.46539,84.5 64.3073288,84.4331663 64.1505832,84.267471 L54.6814758,74.7838597 C54.492689,74.5948001 54.41936,74.4208733 54.41936,74.1818213 L54.41936,55.612271 L35.7997632,36.9656744 C35.4643826,36.6503375 35.4253875,36.4550794 35.6079469,36.0141476 C35.7781814,35.6236509 35.9649729,35.5 36.3978621,35.5 L83.6021393,35.5 C84.0307808,35.5 84.2181279,35.6212357 84.397275,36.026847 C84.5738357,36.4588574 84.5327284,36.653043 84.2361424,36.9308932 Z M51.41936,74.1818213 C51.41936,75.2230693 51.8131569,76.1571028 52.5586216,76.9036451 L61.9994746,86.3581858 C62.6995514,87.0990321 63.6478376,87.5 64.7204264,87.5 C65.2073395,87.5 65.6959494,87.4021371 66.1815505,87.2150906 C67.7458666,86.5338003 68.5806419,85.2691052 68.5806419,83.6363642 L68.5806419,56.8536385 L86.3230911,39.0854571 C87.5120185,37.9727779 87.817222,36.4445475 87.1638665,34.8665253 C86.4981974,33.3365734 85.2344418,32.5 83.6021393,32.5 L36.3978621,32.5 C34.7655597,32.5 33.5018018,33.3365731 32.846676,34.8416909 C32.1827803,36.4445494 32.4879831,37.9727763 33.712812,39.1202361 L51.41936,56.8536101 L51.41936,74.1818213 Z' />
          </IconWrapper>
          <HistoryNode active={active} linked={linked}><div className='title'>{title}</div></HistoryNode>
        </HistoryItemWrapper>
      )
    } else if (type === 'simple') {
      return (
        <HistoryItemWrapper onClick={this.clickHandler} id={active ? 'active' : null}>
          <IconWrapper viewBox='0 0 120 120' />
          <HistoryNode active={active} linked={linked}><div className='title'>{title}</div></HistoryNode>
        </HistoryItemWrapper>
      )
    } else {
      return null
    }
  }
}
