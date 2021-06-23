/*
Note: These files were used in the v1 of npw, but not in v2. Not deleting
them in case of future use.

import heart from './icons/heart.svg'
import shareOld from './icons/share_old.svg'
*/

import PropTypes from 'prop-types'

import React, { Component } from 'react'

import toggleOrbit from './icons/toggle-orbit.svg'
import clusterIcon from './icons/cluster.svg'
import vennIcon from './icons/venn.svg'
import menuIcon from './icons/menu.svg'
// import wikipediaIcon from './icons/wikipedia.svg'
import Image from './Image'
import Navigation from './Navigation'
import {
  VennIcon,
  NodeIcon,
  Title,
  Tags,
  Tag,
  Definition,
  MoreButton,
  EditButton,
  FollowButton,
} from './elements'
import * as Layout from 'elements/layout'
import FamilyIcon from '../FamilyIcon'
import { featureEnabled } from 'utils/features'
import { isCluster } from 'utils/tags'
import ThreeDotExpand from './ThreeDotExpand'
import Icon from 'components/Icon'
import { ensureId } from 'api/utils'

export default class ContentWindow extends Component {
  static propTypes = {
    // General
    linkPreview: PropTypes.bool,
    isVennSearch: PropTypes.bool,
    showPreviewWindow: PropTypes.func,
    hideWindow: PropTypes.func,
    showEditWindow: PropTypes.func,
    definition: PropTypes.string,
    numbers: PropTypes.object,
    loading: PropTypes.bool,
    title: PropTypes.node,
    sidebar: PropTypes.node,
    image: PropTypes.object,

    // the link or node
    item: PropTypes.object,

    // History navigation
    lpwBack: PropTypes.func,
    lpwForward: PropTypes.func,
    nextNode: PropTypes.func,
    prevNode: PropTypes.func,

    previewImg: PropTypes.object,
    saveNodeImage: PropTypes.func,
    onNodeImageDropped: PropTypes.func,
  }
  static defaultProps = {
    numbers: {},
    image: {},
  }
  state = {
    expandDescription: false,
  }
  centerRef = null;

  onCenterClicked = (e) => {
    if (e.target === this.centerRef) {
      this.props.hideWindow()
    }
  }

  titleIcon = () => {
    const {
      linkPreview,
      isVennSearch,
      item,
    } = this.props

    if (linkPreview) {
      return <Icon name='link-straight' style={{ marginRight: 9 }} width={20} height={20} alt='Link' />
    } else if (isVennSearch) {
      return <VennIcon src={vennIcon} alt='Venn Diagram Node' />
    } else if (item && isCluster(item)) {
      return <NodeIcon src={clusterIcon} alt='Cluster' />
    }

    return <NodeIcon src={toggleOrbit} alt='Node' />
  }
  tags = () => {
    const {
      item,
      showPreviewWindow,
    } = this.props
    if (!item || !item.tagList || item.tagList.length === 0) {
      return null
    }

    return item.tagList.map((tag) => {
      const cluster = tag[tag.length - 1]
      const family = tag[0]
      return (
        <Tag
          key={cluster._key}
          onClick={() => showPreviewWindow({ _id: ensureId(cluster._key, 'topics'), ...cluster, nodeId: item._id })}
          style={{
            cursor: 'pointer',
          }}
        >
          <FamilyIcon family={family.title} />
          <span>{cluster.title}</span>
        </Tag>
      )
    })
  }
  render () {
    const {
      // General
      hideWindow,
      showEditWindow,
      definition,
      loading,
      numbers,
      title,
      sidebar,
      image,
      item,
      // Link specific
      lpwBack,
      lpwForward,
      // Node specific
      previewImg,
      saveNodeImage,
      nextNode,
      prevNode,
      // node creation details
      onNodeImageDropped,
    } = this.props
    const longDescription = definition && definition.length > 500
    if (loading) {
      return (
        <div className='node-preview-window'>
          <div
            className='node-preview-window__background-overlay'
            onClick={hideWindow}
          />
          <div className='node-preview-window__wrapper'>
            <div className='node-preview-window__loading'>
              <p>Loading...</p>
            </div>
          </div>
        </div>
      )
    }
    return (
      <div className='node-preview-window'>
        <div
          className='node-preview-window__background-overlay'
          onClick={hideWindow}
        />
        <div className='npw-center-elements' ref={centerRef => { this.centerRef = centerRef }} onClick={this.onCenterClicked}>
          <div className='node-preview-window__wrapper'>
            <Navigation
              nextNode={nextNode}
              prevNode={prevNode}
              lpwBack={lpwBack}
              lpwForward={lpwForward}
              hideWindow={hideWindow}
            />
            {featureEnabled('uploadImages') &&
              <Image
                onImageDropped={onNodeImageDropped}
                previewImg={previewImg}
                saveImage={saveNodeImage}
                imgDescription={image.description}
                img={image.url}
              />
            }
            <div className='node-preview-window__description'>
              <Layout.Row justify='space-between' margin='13px 0 25px 0'>
                <Tags>{this.tags()}
                  {/* {reference && <a href={reference} target='_blank'>
                    <img
                      alt='Links'
                      src={wikipediaIcon}
                    /></a>} */}
                </Tags>

                <Layout.Row alignItems='flex-end'>
                  {featureEnabled('editNodeOrLink') && <EditButton onClick={showEditWindow}>
                    Edit
                  </EditButton>}
                  {featureEnabled('contentWindowMoreOptions') && <img src={menuIcon} alt='More Options' />}
                </Layout.Row>
              </Layout.Row>
              <div className='node-preview-window__description-title'>
                <Title>
                  {this.titleIcon()}
                  {title}
                </Title>
              </div>

              <Definition showAll={this.state.expandDescription || !longDescription}>
                {definition}
              </Definition>
              {longDescription &&
                <MoreButton onClick={() => this.setState({ expandDescription: !this.state.expandDescription })}>
                  {this.state.expandDescription ? 'SEE LESS' : 'SEE MORE'}
                </MoreButton>
              }
            </div>
            {featureEnabled('follow') && <FollowButton longDescription={longDescription}>Follow</FollowButton>}
            {featureEnabled('contentStats') && (<div className='node-preview-window__footer'>
              <div className='node-preview-window__footer-left'>
                <span>
                  {numbers.visits} Visits
                </span>
                <span>
                  {numbers.followers} Followers
                </span>
                <span>
                  {numbers.experts} Experts
                </span>
              </div>
            </div>)}
            <ThreeDotExpand
              item={item}
            />
          </div>
          {sidebar}
        </div>
      </div>
    )
  }
}
