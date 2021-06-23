import React, { Component } from 'react'
import { DefinitionContainer, DefinitionHeading } from './elements'

export default class Definition extends Component {
  render () {
    return (
      <DefinitionContainer>
        <DefinitionHeading>Definition</DefinitionHeading>
        <p>{this.props.definition ? this.props.definition : 'No definition'}</p>
        <DefinitionHeading>References</DefinitionHeading>
        <p>No references</p>
      </DefinitionContainer>
    )
  }
}
