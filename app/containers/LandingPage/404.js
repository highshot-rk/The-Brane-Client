import React, { Component } from 'react'
import { ActivateAcountContainer, WindowWrapper, ContentRight } from './elements'

export default class NotFound extends Component {
  render () {
    return (
      <ContentRight className='content-right-height'>
        <WindowWrapper>
          <ActivateAcountContainer>
            <div className='error-style'>
              <h6>Oops</h6>
              <p className='p-style2'>
                Something went wrong...
              </p>
              <p className='p-style2'>
                That page doesn't exist!
              </p>
            </div>
          </ActivateAcountContainer>
        </WindowWrapper>
      </ContentRight>
    )
  }
}
