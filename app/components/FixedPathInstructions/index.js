import React, { Component } from 'react'
import {
  Instruction,
  Instructions,
} from './elements'

export default class FixedPathInstructions extends Component {
  render () {
    return (
      <Instructions>
        <Instruction>Explore by  dragging a node</Instruction>
        <Instruction>or</Instruction>
      </Instructions>
    )
  }
}
