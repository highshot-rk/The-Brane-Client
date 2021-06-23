import React from 'react'
import PropTypes from 'prop-types'
import * as e from './elements'
import { TargetIcon, PlusIcon, MinusIcon, ArrowIcon } from './icons'
import ToggleOrbit from './icons/ToggleOrbit'
import Icon from 'components/Icon'
import Overlay from 'components/Overlay'
import { featureEnabled } from '../../utils/features'

export default class NavigationBottomBar extends React.PureComponent {
  static propTypes = {
    navPrevious: PropTypes.func,
    navForward: PropTypes.func,
    zoomIn: PropTypes.func,
    zoomOut: PropTypes.func,
    zoomLevel: PropTypes.string,
    centerFocused: PropTypes.func,
    allOrbitsLocked: PropTypes.bool,
    toggleAllOrbits: PropTypes.func,
    exportTopics: PropTypes.func,
    close: PropTypes.func,
    bottomBarMenu: PropTypes.string,
  }
  render () {
    const {
      navPrevious,
      navForward,
      zoomIn,
      zoomOut,
      zoomLevel,
      centerFocused,
      allOrbitsLocked,
      toggleAllOrbits,
      bottomBarMenu,
      close,
      exportTopics,
    } = this.props
    return (
      <div>
        { (bottomBarMenu === 'open') && <Overlay transparent onClose={() => { close() }} />}
        <e.Container allOrbitsLocked={allOrbitsLocked}>
          <e.ActionImg title={'←'} onClick={navPrevious} rotated src={ArrowIcon} />
          <e.ActionImg title={'→'} onClick={navForward} rotated style={{ transform: 'rotate(180deg)' }} src={ArrowIcon} />
          <e.ActionImg title={'ctrl -'} onClick={zoomOut} style={{ flexGrow: 0, flex: 'unset' }} src={MinusIcon} />
          <h1>{zoomLevel}</h1>
          <e.ActionImg title={'ctrl +'} onClick={zoomIn} src={PlusIcon} />
          <e.ActionImg title={'ctrl f'} onClick={centerFocused} src={TargetIcon} />
          <ToggleOrbit allOrbitsLocked={allOrbitsLocked} onClick={toggleAllOrbits} />
          {featureEnabled('export') &&
          <e.Action onClick={exportTopics}>
            <Icon name='export' width={16} />
          </e.Action>
          }
        </e.Container>
      </div>
    )
  }
}
