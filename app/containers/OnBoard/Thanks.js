import React, { Component } from 'react'
import { Submit } from 'elements/form'

export default class Thanks extends Component {
  render () {
    const { fn, finish } = this.props
    return (
      <div className='thanks'>
        <div>
          <h5>All done {fn}!</h5>
          <p className='title'>
            Thank you for helping to make the Community Graph a reality.
            We'll let you know when it's ready!</p>
        </div>
        <div className='thanks-submit'>
          <Submit className='thanks-btn' onClick={finish}>CONTINUE TO THE BRANE</Submit>
        </div>
      </div>
    )
  }
}
