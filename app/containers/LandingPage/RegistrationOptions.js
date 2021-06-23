import React from 'react'
import { SocialBtn } from './elements'
import mailIcon from './icons/mail_white.svg'
import FbButton from './FbButton'
import InButton from './InButton'
import GoAuth from './GoButton'
import { featureEnabled } from 'utils/features'

export default ({ onMailClick }) => {
  return (
    <div>
      <InButton isRegistration />
      { featureEnabled('facebookLogin') && <FbButton isRegistration /> }
      { featureEnabled('googleLogin') && <GoAuth isRegistration /> }
      <SocialBtn onClick={onMailClick} style={{ margin: '0' }}>
        <img src={mailIcon} /> <div>Sign up with Email</div>
      </SocialBtn>
    </div>
  )
}
