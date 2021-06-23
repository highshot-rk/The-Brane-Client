import React from 'react'
import PropTypes from 'prop-types'
import defaultProfileImage from 'components/Icons/default_profile.svg'
import * as e from './elements'
import { CrossIcon } from './icons'
import explore from './icons/explore.png'
import read from './icons/read.png'
import target from './icons/target.svg'
import { featureEnabled } from 'utils/features'
import {
  withRouter,
} from 'react-router-dom'

export class Dropup extends React.Component {
  static propTypes = {
    addProfileNode: PropTypes.func,
    closeProfileMenu: PropTypes.func,
    expandCollapsedUserProfile: PropTypes.func,
    openProfileMenu: PropTypes.func,
    showProfileMenu: PropTypes.bool,
    profile: PropTypes.object,
    userId: PropTypes.string,
    history: PropTypes.object,
  }
  constructor (props) {
    super(props)
    const { profile } = this.props
    this.state = {
      target: false,
      profile: {
        isUserNode: true,
        imageUrl: profile.picture,
        name: `${profile.firstName} ${profile.lastName}`,
      },
    }
  }

  toggleMenu = () => {
    const { showProfileMenu, openProfileMenu, closeProfileMenu } = this.props
    if (showProfileMenu) {
      closeProfileMenu()
    } else {
      openProfileMenu()
    }
  }

  explore = () => {
    const {
      closeProfileMenu,
      addProfileNode,
      expandCollapsedUserProfile,
      userId,
    } = this.props

    closeProfileMenu()
    addProfileNode({
      userId,
      name: this.state.profile.name,
      imageUrl: null,
    })
    expandCollapsedUserProfile(userId)
  }
  openProfileMenu = () => {
    const {
      userId,
      closeProfileMenu,
    } = this.props

    closeProfileMenu()
    this.props.history.push(`/profile/${userId}`)
  }

  menuItems = () => {
    const items = []

    if (featureEnabled('userMenu')) {
      items.push([
        <div key={'profile'} onClick={this.openProfileMenu} tabIndex='0' role='button'>
          <img src={read} alt='info' />
        </div>,
        <div key={'explore'} title='Explore' onClick={this.explore} tabIndex='0' role='button'>
          <img src={this.state.target ? target : explore} alt='explore' />
        </div>,
      ])
    }
    return items
  }

  render () {
    const { showProfileMenu, closeProfileMenu } = this.props
    const imgUrl = this.state.profile.imageUrl || defaultProfileImage

    return (
      <e.DropupContainer isOpen={showProfileMenu} onClick={() => showProfileMenu && closeProfileMenu()}>
        <e.Wrapper>
          <e.Thumb
            defaultImage={!this.state.profile.imageUrl}
            title='Profile'
            onClick={this.toggleMenu}
            visibleMenu={showProfileMenu}>
            <img src={imgUrl} alt='profile' />
            <span>{CrossIcon}</span>
          </e.Thumb>
          <e.MenuContainer menuOpen={showProfileMenu} isTarget={this.state.target}>
            {this.menuItems()}
          </e.MenuContainer>
        </e.Wrapper>
      </e.DropupContainer>
    )
  }
}

export default withRouter(Dropup)
