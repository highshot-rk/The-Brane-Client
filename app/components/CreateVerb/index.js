import React, { Component } from 'react'
import {
  InputContainer,
} from './elements'
import LinkDirectionToggle from '../LinkDirectionToggle'
import {
  WindowHeader,
  Window,
  WindowWrapper,
} from 'elements/window'
import {
  Submit,
  Cancel,
  FormActions,
} from 'elements/form'
import {
  Row,
} from 'elements/layout'
import withFormWindowLogic from '../FormWindowLogic'
import Overlay from '../Overlay'
import styled from 'styled-components'

const SpaciousInput = styled(InputContainer)`
  margin-left: 50px;
`

export class CreateVerb extends Component {
  render () {
    return (
      <WindowWrapper zIndex={11}>
        <Overlay onClose={this.props.onClose} />
        <Window>
          <WindowHeader>Create a link title</WindowHeader>
          <Row style={{ marginBottom: 50, marginLeft: 25 }}>
            <LinkDirectionToggle isParent oneDirection />
            <SpaciousInput value={this.props.data.down} onChange={e => this.props.setData({ down: e.target.value })}>
              <input type='text' />
            </SpaciousInput>
          </Row>
          <Row style={{ marginBottom: 66, marginLeft: 25 }}>
            <LinkDirectionToggle isParent={false} oneDirection />
            <SpaciousInput value={this.props.data.up} onChange={e => this.props.setData({ up: e.target.value })}>
              <input type='text' />
            </SpaciousInput>
          </Row>
          <FormActions>
            <Cancel onClick={this.props.onCancel}>Cancel</Cancel>
            <Submit
              disabled={!this.props.readyToSubmit}
              onClick={this.props.onSave}>Create</Submit>
          </FormActions>
        </Window>
      </WindowWrapper>)
  }
}

export default withFormWindowLogic(CreateVerb, {
  defaultData: {
    down: '',
    up: '',
  },
  readyForSubmit (data) {
    return data.up.length && data.down.length
  },
  onSave (data, props) {
    props.onClose(data.down, data.up)
  },
})
