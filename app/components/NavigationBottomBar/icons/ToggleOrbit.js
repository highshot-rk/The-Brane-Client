import React from 'react'
import PropTypes from 'prop-types'
import { lock, lockWhite } from 'components/NodeMenu/icons'
import { NodeItem } from 'components/NodeMenu/elements'
import { ToggleOrbitContainer } from '../elements'

const ToggleOrbit = ({ allOrbitsLocked, onClick }) => {
  return (
    <ToggleOrbitContainer
      xmlns='http://www.w3.org/2000/svg'
      viewBox='-30 -30 65 65'
      onClick={onClick}
      width='32'
      height='32'
    >
      <NodeItem
        itemName='lockOrbit'
        orbitLocked={allOrbitsLocked}
        fillIcon={allOrbitsLocked ? 'white' : 'rgba(255, 255, 255, 0.6)'}>
        {allOrbitsLocked ? lockWhite : lock}
      </NodeItem>
    </ToggleOrbitContainer>
  )
}

ToggleOrbit.propTypes = {
  allOrbitsLocked: PropTypes.bool,
  onClick: PropTypes.func,
}

export default ToggleOrbit
