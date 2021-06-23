import React from 'react'
import { ActivateAcountContainer } from './elements'
import { Submit } from 'elements/form'
export default ({ onContinue, name, isDismiss }) => {
  return (
    <ActivateAcountContainer style={{ height: '338px' }} >
      <h1>Thanks for signing up</h1>
      <p>Welcome {name} !<br />
        A universe of knowledge awaits. We hope you enjoy your journey.
      </p>
      {isDismiss &&
      <p>
        You will be able to fill your profile any time through Profile Editing
      </p>
      }
      <Submit onClick={onContinue}>Browse The Brane</Submit>
    </ActivateAcountContainer>
  )
}
