import React, { Component } from 'react'
import PropTypes from 'prop-types'
import * as e from './elements'
import doorIcon from './icons/Door.png'
import accountIcon from './icons/Account.svg'
import helpIcon from './icons/Help.svg'
import puzzleIcon from './icons/Puzzle.svg'
import slackIcon from './icons/Slack.svg'
import { featureEnabled } from 'utils/features'
import {
  withRouter,
} from 'react-router-dom'

const accounts = featureEnabled('accounts')
const buildMenu = featureEnabled('buildMenu')

const Items = [
  accounts && { name: 'Account', icon: accountIcon },
  { name: 'Help', icon: helpIcon },
  { name: 'Slack', icon: slackIcon },
  buildMenu && { name: 'Build', icon: puzzleIcon },
  accounts && { name: 'Log-out', icon: doorIcon },
]

export class ExpandedSideBar extends Component {
  static propTypes = {
    logout: PropTypes.func,
    close: PropTypes.func,
    history: PropTypes.object,
    match: PropTypes.object,
    auth: PropTypes.object,
  }

  onClick = (name) => {
    this.props.close()

    switch (name) {
      case 'Account':
        this.props.history.push({
          pathname: `/graph/${this.props.match.params.graphName}/profile/${this.props.auth.user.id}` })
        break
      case 'Help':
        window.open('https://docs.google.com/document/d/18BKqceigO7Kz9COh5Flstqz5B_-H-jlr-ca75fy1VRU/edit?usp=sharing', '_blank')
        break
      case 'Slack':
        window.open('https://join.slack.com/t/the-brane-alpha/signup', '_blank')
        break
      case 'Log-out':
        this.props.logout()
    }
  }

  render () {
    return (
      <e.Drop>
        <ul>
          {
            Items
              .filter(item => item)
              .map(item => (
                <li key={item.name} onClick={() => this.onClick(item.name)}>
                  {item.name}
                  <img className={`${item.name}-icon`} src={item.icon} alt={item.name} />
                </li>
              ))
          }
        </ul>
      </e.Drop>
    )
  }
}

export default withRouter(ExpandedSideBar)
