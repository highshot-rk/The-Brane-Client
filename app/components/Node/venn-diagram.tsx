import { VennCenter, VennText, WhiteCenter } from './elements'
import React from 'react'
import { wrapText } from 'utils/svg'
import { MAX_CENTER_TITLE_LENGTH } from 'components/Node'

type Props = {
  onClick?: ((event: React.MouseEvent) => void),
  scale: number,
  singleNodeView?: boolean,
  // TODO: add type for vennIds
  vennIds?: any,
  menuOpen?: boolean,
  nodeCount?: number
}

export default class VennDiagram extends React.Component<Props> {
  createText (text: string, x: number, singleNodeView: boolean) {
    let textWidth = 100 - 10
    let fontSize = 14 * (2 - this.props.scale)
    let y = 5
    let anchor = 'start'
    let originalTitle = text

    if (singleNodeView) {
      y = x + 30
      x = 0
      anchor = 'middle'
    }

    if (text.length > MAX_CENTER_TITLE_LENGTH) {
      text = `${text.substring(0, MAX_CENTER_TITLE_LENGTH)}...`
    }

    let lines = wrapText(text, fontSize, textWidth)
    let tspans = lines.map((line: string, i: number) => {
      return (
        <tspan
          key={i}
          dy={`${i === 0 ? '0' : '1.2'}em`}
          x={0}
        >
          {line}
        </tspan>
      )
    })

    let textHeight = 1.125 * (lines.length - 1)
    return (
      <text
        style={{ fontSize }}
        y={`-${textHeight / 2}em`}
        transform={`rotate(${singleNodeView ? -90 : 0}) translate(${x}, ${y})`}
        textAnchor={anchor}
      >
        {tspans}
        {originalTitle !== text ? <title>{originalTitle}</title> : null}
      </text>
    )
  }
  render () {
    // This seems to be too small to be the width, but it is the
    // only value that correctly centers the diagram
    const WIDTH = 98
    let translateX = -1 * WIDTH / 2
    let translateY = 0
    let rotate = this.props.singleNodeView ? 90 : 0

    if (this.props.singleNodeView) {
      translateX += 75
      translateY = -50
    }

    let text: React.ReactNode[] = []
    if (this.props.vennIds) {
      let countTranslate = { x: rotate ? -6 : 40, y: rotate ? 55 : 5 }
      text = [
        this.createText(this.props.vennIds[0].query, -80, this.props.singleNodeView),
        <VennText
          textAnchor='center'
          menuOpen={this.props.menuOpen}
          transform={`rotate(${-1 * rotate}) translate(${countTranslate.x}, ${countTranslate.y})`}
          style={{ fill: '#000' }}
          fill='#fff'>
          {this.props.nodeCount}
        </VennText>,
        this.createText(this.props.vennIds[1].query, 105, this.props.singleNodeView),
      ]
    }

    let operationType = this.props.vennIds[1].type

    switch (operationType) {
      case 'intersection':
        return (
          <g transform={`scale(${this.props.scale},${this.props.scale}) translate(${translateX}, ${translateY}) rotate(${rotate})`}
            onClick={this.props.onClick}
          >
            <defs>
              <clipPath id='vennDiagramClip'>
                <circle cx={-10} r={100} />
              </clipPath>
            </defs>
            <circle cx={-10} r={100} fill='#FFF' />
            <circle cx={110} r={100} fill='#FFF' />
            <VennCenter menuOpen={this.props.menuOpen} cx={110} r={100} clipPath='url(#vennDiagramClip)' />
            {text}
          </g>
        )
      case 'union':
        return (
          <g transform={`scale(${this.props.scale},${this.props.scale}) translate(${translateX}, ${translateY}) rotate(${rotate})`}
            onClick={this.props.onClick || function () {}}
          >
            <defs>
              <clipPath id='vennDiagramClip'>
                <circle cx={-10} r={100} />
              </clipPath>
            </defs>
            <circle cx={-10} r={100} fill='#8662DF' />
            <circle cx={110} r={100} fill='#8662DF' />
            <VennCenter menuOpen={this.props.menuOpen} cx={110} r={100} clipPath='url(#vennDiagramClip)' />
            {text}
          </g>
        )
      case 'difference':
        return (
          <g transform={`scale(${this.props.scale},${this.props.scale}) translate(${translateX}, ${translateY}) rotate(${rotate})`}
            onClick={this.props.onClick || function () {}}
          >
            <defs>
              <clipPath id='vennDiagramClip'>
                <circle cx={-10} r={100} />
              </clipPath>
            </defs>
            <circle cx={-10} r={100} fill='#8662DF' />
            <circle cx={110} r={100} fill='#8662DF' />
            <WhiteCenter menuOpen={this.props.menuOpen} cx={110} r={100} clipPath='url(#vennDiagramClip)' />
            {text}
          </g>
        )
      default:
        return (
          <g transform={`scale(${this.props.scale},${this.props.scale}) translate(${translateX}, ${translateY}) rotate(${rotate})`}
            onClick={this.props.onClick || function () {}}
          >
            <defs>
              <clipPath id='vennDiagramClip'>
                <circle cx={-10} r={100} />
              </clipPath>
            </defs>
            <circle cx={-10} r={100} fill='#8662DF' />
            <circle cx={110} r={100} fill='#FFF' />
            {text}
          </g>
        )
    }
  }
}
