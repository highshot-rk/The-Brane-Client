import React from 'react'
import { PopupContainer } from './elements'
import { CloseIcon } from '../../containers/HomePage/icons'

const NotificationPopup = ({ bgColor, textColor, message, closePopup, show }) => (
  <PopupContainer show={show} bgColor={bgColor} textColor={textColor}>
    <CloseIcon onClick={closePopup} width='10' height='10' />
    <h5 dangerouslySetInnerHTML={{ __html: message }} />
  </PopupContainer>
)

export default NotificationPopup
