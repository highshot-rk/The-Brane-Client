import React, { Component } from 'react'
import { ErrorWrapper } from './elements'
import { GraphBtn } from '../App/elements'
import { Redirect } from 'react-router-dom'

export default class GraphUnauthorized extends Component {
  constructor (props) {
    super(props)
    this.state = {
      navigate: false,
      referrer: null,
    }
  }
  onClick = (graph) => {
    this.setState({
      referrer: `/graph/${graph}`,
    })
  }
  render () {
    const { referrer } = this.state
    if (referrer) {
      window.location.reload()
      return <Redirect to={referrer} />
    }
    return (
      <ErrorWrapper>
        <h2>Unauthorized</h2>
        <p>You do not have access to this graph.</p>
        <h2>Available Graphs:</h2>
        <br />
        <div className='graphs'>
          {this.props.allowedGraphs.map(graph => {
            return (<GraphBtn className='login-error social-margin' onClick={() => this.onClick(graph)}>{graph + ' graph'}</GraphBtn>)
          })}
        </div>
      </ErrorWrapper>
    )
  }
}
