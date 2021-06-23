import React from 'react'

import HistoryItem from './HistoryItem'
import History from './History'
import expandIcon from './icons/Expand.svg'
import contractIcon from './icons/Contract.svg'
import {
  Window,
  Header,
  Title,
  Body,
  Separator,
  MinimizeButton,
  ExpandContractIcon,
  FlexRow,
} from './elements'
import { Dots } from './icons/Dots'

class LineageToolUI extends React.Component {
  isNodeLinked = (id) => {
    return false
  }

  renderPaths = paths => {
    return (
      paths.map((path, pathIndex) =>
        path.history.map(
          (historyEvent, index) =>
            <HistoryItem
              key={index}
              linked={index === 0}
              pathIndex={pathIndex}
              handleClick={this.props.handleHistoryItemClick}
              {...historyEvent} />
        ).concat([pathIndex !== paths.length - 1 ? <Separator key={`separator-${pathIndex}`} /> : null])
      )
    )
  }

  render () {
    const {
      paths,
      nodeMenuOpen,
      isPathWindowMinimized,
      isPathWindowExpanded,
      toggleExpanded,
      focusPathWindow,
      toggleMinimize } = this.props
    if (paths.length === 1 && paths[0].history.length === 1) {
      return null
    }

    let showExpandContract = false
    paths.map(path => {
      if (path.history.length > 3) {
        showExpandContract = true
      }
    })

    return (
      <Window
        onMouseEnter={() => focusPathWindow(true)}
        onMouseLeave={() => focusPathWindow(false)}
        isPathWindowMinimized={isPathWindowMinimized}
        isPathWindowExpanded={isPathWindowExpanded}
        fade={nodeMenuOpen}>
        <FlexRow>
          <section>
            <Header fade={nodeMenuOpen}>
              <Title>Path</Title>
              {showExpandContract &&
                <ExpandContractIcon
                  src={isPathWindowExpanded ? contractIcon : expandIcon} onClick={toggleExpanded} />}
            </Header>
            <Body>
              <History>
                {this.renderPaths(paths)}
              </History>
            </Body>
          </section>
          <section>
            <MinimizeButton onClick={toggleMinimize}>
              <Dots color={isPathWindowMinimized ? 'gray' : 'white'} />
            </MinimizeButton>
          </section>
        </FlexRow>
      </Window>
    )
  }
}

export default LineageToolUI
