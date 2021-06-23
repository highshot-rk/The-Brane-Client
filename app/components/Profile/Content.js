import React, { Component } from 'react'
import Publications from './publications'
import { ContentWrapper } from './elements'
import ActivityTab from './activityTab'
import Paths from './Paths'
import Settings from './Settings'
import PropTypes from 'prop-types'
import { node } from 'utils/shared-proptypes'

export default class Content extends Component {
  static propTypes = {
    toggleNewPublication: PropTypes.func,
    confirmRestoreSavedPath: PropTypes.func,
    userId: PropTypes.string,
    activeTab: PropTypes.string,
    profile: PropTypes.object,
    saveChanges: PropTypes.func,
    onDeleteAccount: PropTypes.func,
    activePathId: PropTypes.string,
    focusedNode: node,
    restoreSavedPath: PropTypes.func,
  }
  selectComponent = () => {
    switch (this.props.activeTab) {
      case 'Paths':
        return <Paths
          activePathId={this.props.activePathId}
          focusedNode={this.props.focusedNode}
          restoreSavedPath={this.props.restoreSavedPath}
          confirmRestoreSavedPath={this.props.confirmRestoreSavedPath}

        />
      case 'Publications':
        return (
          <Publications
            toggleNewPublication={this.props.toggleNewPublication}
            userId={this.props.userId} />
        )

      case 'Activity':
        return <ActivityTab />
      case 'Settings':
        return <Settings saveChanges={this.props.saveChanges} profile={this.props.profile} onDeleteAccount={this.props.onDeleteAccount} />
      default:
        throw new Error('Unknown tab' + this.props.activeTab)
    }
  }
  render () {
    return (
      <ContentWrapper>
        <div>
          {this.selectComponent()}
        </div>
      </ContentWrapper>
    )
  }
}
