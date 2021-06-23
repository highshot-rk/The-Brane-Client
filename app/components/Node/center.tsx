import React from 'react'
import VennDiagram from './venn-diagram'
import { wrapText } from 'utils/svg'
import { ClusterIcon } from './icons'
import { C02_DARK, C01_LIGHT } from 'styles/colors'
import { ENTER } from 'utils/key-codes'
import { CenterWrapper } from './elements'
import defaultProfileImage from 'components/Icons/default_profile.svg'
import {
  BRANE_NODE_ID, VENN_ID,
} from '../../constants'
import {
  isCluster,
} from 'utils/tags'
import Icon from 'components/Icon'
import { MAX_CENTER_TITLE_LENGTH } from 'components/Node'
import { SourceNode } from 'containers/FixedPath/types'

const CENTER_TEXT_X_POSITION = -7
const CENTER_TEXT_X_POSITION_SINGLE_NODE = 35

const CENTER_TEXT_Y_POSITION = 105
const CENTER_TEXT_Y_POSITION_SINGLE_NODE = 250
const THOUSANDS_REGEX = /\B(?=(\d{3})+(?!\d))/g

const toThousandsFormat = (number: number) => number && number.toString().replace(THOUSANDS_REGEX, ',')

type Props = {
  parent: SourceNode,
  text: string,
  radius: number,
  nodeCount: number,
  parentClicked: (
    node: {_id: string, title: string},
    x: number,
    y: number,
    isChild: boolean,
    parentId: string,
    radius: number,
    enterEvent: boolean
  ) => void,
  animationDelay: number,
  initialAppear: boolean,
  // TODO: fix inconsistent type
  menuOpen: boolean | Object,
  overlayOpen: boolean,
  singleNodeView: boolean,
  focused: boolean,
  showTitle: boolean,

  // TODO: remove this since it isn't used
  onMouseOverNode: ((event: React.MouseEvent) => void),

  // TODO: remove user node code
  isUserNode: boolean
}

type State = {
  firstRender: boolean,
  // TODO: remove user node code
  userProfileAnimationCalled: boolean,
  preventIntermittentRender: boolean,
}

export class Center extends React.Component <Props, State> {
  state = {
    firstRender: true,
    userProfileAnimationCalled: false,
    preventIntermittentRender: true,
  }

  static defaultProps: any = {
    isUserNode: false,
    text: '',
    animationDelay: 0,
    parent: {
      _id: 'node',
    },
  }

  // TODO: fix inconsistent type
  parentClicked = (enterEvent: React.MouseEvent | boolean) => {
    this.props.parentClicked(
      { _id: this.props.parent._id, title: this.props.parent.title },
      0, 0, false, this.props.parent._id, this.props.radius, !!enterEvent)
  }

  render () {
    let center
    let radius = this.props.radius

    let vennIds = this.props.parent.vennIds || []

    // Font size is based on radius.
    let fontSize = Math.max(10, Math.min(17, Math.floor(Math.sqrt(radius) * 1.9)))
    let style = { fontSize }
    let countStyle = {
      fontSize: fontSize * 0.8,
    }

    if (this.props.parent._id === BRANE_NODE_ID) {
      const { singleNodeView, focused, parent, menuOpen } = this.props
      const totalNodesText = parent.totalNodes ? `${toThousandsFormat(parent.totalNodes)} nodes` : ''
      const textX = singleNodeView ? totalNodesText.length + CENTER_TEXT_X_POSITION_SINGLE_NODE : -1 * totalNodesText.length - CENTER_TEXT_X_POSITION
      const textY = singleNodeView ? CENTER_TEXT_Y_POSITION_SINGLE_NODE : CENTER_TEXT_Y_POSITION
      center = (
        <g onClick={this.parentClicked} transform={`translate(${-radius * 0.75}, ${-radius * 0.75})`}>
          <Icon name='brane' className='node__center__brane-icon' width={radius * 1.5} height={radius * 1.5} />
          {focused && <text x={textX} textAnchor='start' fontWeight={100} fontSize='14px' fill={menuOpen ? C02_DARK : C01_LIGHT} y={textY}>{totalNodesText}</text>}
        </g>
      )
    } else if (this.props.parent._id !== VENN_ID) {
      let textWidth = radius * 2 - 20
      // Wraps text into lines, and then removes lines that are false (empty strings)
      let title = this.props.text
      let origTitle = title
      if (title.length > MAX_CENTER_TITLE_LENGTH) {
        title = `${title.substring(0, MAX_CENTER_TITLE_LENGTH)}...`
      }
      let lines = wrapText(title, fontSize, textWidth).filter(Boolean)

      let text = lines.map((line: string, i: number) => {
        return (
          <tspan key={i} x={0} dy={`${i === 0 ? '0' : '1.2'}em`}>
            {line}
          </tspan>
        )
      })

      let textHeight = 1.125 * (lines.length - 1)

      center = (
        <text
          style={style}
          onClick={this.parentClicked}
          y={`-${textHeight / 4}em`}
          textAnchor={'middle'}>
          {title.length > MAX_CENTER_TITLE_LENGTH && <title>{origTitle}</title>}
          {text}
          {this.props.nodeCount
            ? <tspan
              style={countStyle}
              className='node__center__node-count'
              x={'0px'}
              dy='1.2em'>
              {this.props.nodeCount}
            </tspan> : null }
            <title>{origTitle}</title>
        </text>
      )
    }

    // Starting scale for animation.
    let scale = 0.4
    if (!this.state.firstRender) {
      scale = radius / 100
    }
    let circleTransform = `scale(${scale}, ${scale})`

    let mainClass = 'node__center-node'
    let circle
    if (vennIds && vennIds.length > 1) {
      circle = (
        <VennDiagram
          scale={scale}
          vennIds={vennIds}
          nodeCount={this.props.nodeCount}
          onClick={this.parentClicked}
          singleNodeView={this.props.singleNodeView}
          menuOpen={!!this.props.menuOpen}
        />
      )
    } else if (this.props.isUserNode) {
      // Disable text
      center = null

      const profileMenu = document.querySelector('img[alt="profile"]')

      // Hide profile icon in bottom right
      if (profileMenu) {
        profileMenu
          .closest('div')
          .style.cssText = 'transform: scale(0, 0)'
      }

      // Translations dimensions for user profile icon
      const h = document.body.clientHeight
      const w = document.body.clientWidth

      const strokeWidth = this.props.parent.imageUrl ? '2px' : 0

      circle =
        <g>
          <defs>
            <pattern
              id='profile_image'
              x='0'
              y='0'
              height='100%'
              width='100%'
              patternContentUnits='objectBoundingBox'
              viewBox='0 0 1 1'
              preserveAspectRatio='xMidYMid slice'
            >
              <image
                x='0'
                y='0'
                height='1'
                width='1'
                preserveAspectRatio='xMidYMid slice'
                xlinkHref={this.props.parent.imageUrl || defaultProfileImage}
              />
            </pattern>
          </defs>
          <circle
            id='profile-node'
            onClick={this.parentClicked}
            fill='url(#profile_image)'
            style={profileMenu ? {
              transform: `translate(${w / 2.22}px, ${h / 2.205}px) scale(0.29, 0.29)`,
              transition: '0.7s',
              strokeWidth,
            } : { transform: circleTransform, strokeWidth }}
            r={100}
          />
          {(this.props.focused || this.props.showTitle) &&
          <text
            onClick={this.parentClicked}
            y={radius + 14 + 9}
            x={0}
            style={{
              fill: '#fff',
              fontSize: '17px',
              fontWeight: 300,
            }}
            textAnchor={'middle'}>
            {this.props.text}
          </text>
          }
        </g>

      // TODO: remove profile node code
      const profileNode = document.querySelector('#profile-node') as any

      if (profileMenu && profileNode && !this.state.userProfileAnimationCalled) {
        // Intentionally not using setState to not rerender.
        // This is used to not animate when clicking on the
        // already animated node.

        this.state.userProfileAnimationCalled = true

        // animate icon to center of screen
        setTimeout(() => {
          // first timeout of 0ms to call on the next event loop,
          // which is after the component is rendered
          profileNode.style.cssText += `
            transform: scale(0.29, 0.29);
          `
          // In 1700ms (100ms after profile node reaches center), scale up
          setTimeout(() => {
            if (this.props.radius === 65) {
              profileNode.style.cssText += `
                transform: ${circleTransform};
                transition: 0.7s;
              `
            } else {
              // Fixes node size after collapsing user node, then expanding parent
              profileNode.style.cssText += `
                transform: scale(0.45, 0.45);
                transition: 0.7s;
              `
            }
            // Fixes an issue when the rerender caused by setState in componentDidMount
            // interupts the animation.
            this.state.preventIntermittentRender = false
          }, 800)
        }, 0)
      } else if (profileNode && this.state.userProfileAnimationCalled && !this.state.preventIntermittentRender) {
        // Disable animations when resizing browser
        setTimeout(() => {
          profileNode.style.cssText += `
            transform: ${circleTransform};
            transition: 0.7s;
          `
        }, 0)
      } // Evaluate Cluster
    } else if (
      this.props.parent._id !== BRANE_NODE_ID &&
      isCluster(this.props.parent)
    ) {
      circle = <ClusterIcon
        isCenter
        onClick={this.parentClicked}
        fill={'#fff'}
        style={{
          transform: circleTransform,
          animationDelay: `${this.props.animationDelay}ms`,
          animationDuration: `${this.props.animationDelay > 0 ? 700 : 0.01}ms`,
        }}
        r={105} />
    } else { // basic circle, no image
      circle = <circle
        onClick={this.parentClicked}
        fill={'#fff'}
        style={{
          transform: circleTransform,
          animationDelay: `${this.props.animationDelay}ms`,
          animationDuration: `${this.props.animationDelay > 0 ? 700 : 0.01}ms`,
        }}
        r={100} />
    }

    return (
      <CenterWrapper
        initialAppear={this.props.initialAppear}
        transform={`translate(0, 0)`}
        className={mainClass}
        onMouseEnter={this.props.onMouseOverNode}
      >
        {circle}
        {vennIds && vennIds.length < 2 && center}
      </CenterWrapper>
    )
  }

  fixedPathKeyDownHandler = (e: KeyboardEvent) => {
    const { menuOpen, overlayOpen } = this.props
    if (
      !menuOpen &&
      !overlayOpen &&
      e.keyCode === ENTER
    ) {
      this.props.focused && this.parentClicked(true)
    }
  }

  componentWillMount () {
    document.addEventListener('keydown', this.fixedPathKeyDownHandler)
  }

  componentDidMount () {
    if (this.state.firstRender) {
      // firstRender has to be set to false
      // after the render actually happens
      // In the current version of React,
      // the callback to requestAnimationFrame runs
      // after the render.
      requestAnimationFrame(() => {
        this.setState({
          firstRender: false,
          preventIntermittentRender: true,
        })
      })
    }
  }

  componentWillUnmount () {
    if (this.props.isUserNode) {
      // unhide Dropup component
      try {
        document.querySelector('img[alt="profile"]')
          .closest('div')
          .style.cssText = `
          transform: scale: (0.5, 0.5);
          transition: 0.5s;
        `
      } catch (e) {

      }
    }
    document.removeEventListener('keydown', this.fixedPathKeyDownHandler)
  }
}

export default Center
