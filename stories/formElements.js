import React from 'react'
import { storiesOf } from '@storybook/react'
import {
  SectionTitle,
  Submit,
  Cancel,
  FormActions,
  AddRowButton,
  CheckedRowButton,
  RemoveRowButton,
  HiddenLink,
  LargeButton,
  ErrorMessage,
} from '../app/elements/form'
import {
  WindowWrapper,
  Window,
} from '../app/elements/window'
import PropTypes from 'prop-types'

function Wrapper ({ children }) {
  return <WindowWrapper>
    <Window>
      {children}
    </Window>
  </WindowWrapper>
}

Wrapper.propTypes = {
  children: PropTypes.element,
}

function SolidWrapper ({ children }) {
  return <WindowWrapper style={{ background: 'rgb(50, 50, 50)' }}>
    {children}
  </WindowWrapper>
}

SolidWrapper.propTypes = {
  children: PropTypes.element,
}

storiesOf('SectionTitle', module)
  .add('default', () => (
    <Wrapper>
      <SectionTitle>
        Title
      </SectionTitle>
    </Wrapper>
  ))

storiesOf('Submit', module)
  .add('default', () => (
    <Wrapper>
      <Submit>Submit</Submit>
    </Wrapper>
  ))
  .add('disabled', () => (
    <Wrapper>
      <Submit disabled>Submit</Submit>
    </Wrapper>
  ))
  .add('showAsDisabled', () => (
    <Wrapper>
      <Submit showAsDisabled>Submit</Submit>
    </Wrapper>
  ))

storiesOf('Cancel', module)
  .add('default', () => (
    <Wrapper>
      <Cancel>Cancel</Cancel>
    </Wrapper>
  ))

storiesOf('HiddenLink', module)
  .add('default', () => (
    <Wrapper>
      <HiddenLink>This is a hidden link</HiddenLink>
      <HiddenLink>This is another hidden link</HiddenLink>
    </Wrapper>
  ))
  .add('spacious', () => (
    <Wrapper>
      <HiddenLink spacious>This is a hidden link</HiddenLink>
      <HiddenLink spacious>This is another hidden link</HiddenLink>
    </Wrapper>
  ))

storiesOf('ErrorMessage', module)
  .add('default', () => (
    <Wrapper>
      <ErrorMessage>
        Name must be provided.
      </ErrorMessage>
    </Wrapper>
  ))

storiesOf('LargeButton', module)
  .add('default', () => (
    <SolidWrapper>
      <LargeButton>Explore</LargeButton>
    </SolidWrapper>
  ))
  .add('transparent buttonStyle', () => (
    <SolidWrapper>
      <LargeButton buttonStyle='transparent'>Explore</LargeButton>
    </SolidWrapper>
  ))
  .add('transparent', () => (
    <SolidWrapper>
      <LargeButton transparent>Explore</LargeButton>
    </SolidWrapper>
  ))
  .add('custom background', () => (
    <SolidWrapper>
      <LargeButton background='#5f5f5f'>Explore</LargeButton>
    </SolidWrapper>
  ))
  .add('custom color', () => (
    <SolidWrapper>
      <LargeButton color='#DDD'>Explore</LargeButton>
    </SolidWrapper>
  ))

storiesOf('Formactions', module)
  .add('default', () => (
    <Wrapper>
      <FormActions>
        <Cancel>Cancel</Cancel>
        <Submit>Submit</Submit>
      </FormActions>
    </Wrapper>
  ))

storiesOf('AddRowButton', module)
  .add('default', () => (
    <Wrapper>
      <AddRowButton>
        <button>+</button>
        <span>Item Title</span>
      </AddRowButton>
      <AddRowButton>
        <button>+</button>
        <span>Item Title</span>
      </AddRowButton>
    </Wrapper>
  ))
  .add('condensed', () => (
    <Wrapper>
      <AddRowButton condensed>
        <button>+</button>
        <span>Item Title</span>
      </AddRowButton>
      <AddRowButton condensed>
        <button>+</button>
        <span>Item Title</span>
      </AddRowButton>
    </Wrapper>
  ))
  .add('gray', () => (
    <Wrapper>
      <AddRowButton gray>
        <button>+</button>
        <span>Item Title</span>
      </AddRowButton>
      <AddRowButton gray>
        <button>+</button>
        <span>Item Title</span>
      </AddRowButton>
    </Wrapper>
  ))

storiesOf('CheckedRowButton', module)
  .add('default', () => (
    <Wrapper>
      <CheckedRowButton>
        <button>{'✓'}</button>
        <span>Item Title</span>
      </CheckedRowButton>
      <CheckedRowButton>
        <button>{'✓'}</button>
        <span>Item Title</span>
      </CheckedRowButton>
    </Wrapper>
  ))

storiesOf('RemoveRowButton', module)
  .add('default', () => (
    <Wrapper>
      <RemoveRowButton>
        <button>&times;</button>
        <span>Item Title</span>
      </RemoveRowButton>
      <RemoveRowButton>
        <button>&times;</button>
        <span>Item Title</span>
      </RemoveRowButton>
    </Wrapper>
  ))
