import React from 'react'
import { storiesOf } from '@storybook/react'
import {
  WindowWrapper,
  Window,
  WindowHeader,
  Popup,
} from '../app/elements/window.js'

storiesOf('WindowWrapper', module)
  .add('default', () => (
    <WindowWrapper>
      <h1>Content</h1>
    </WindowWrapper>
  ))

storiesOf('Window', module)
  .add('default', () => (
    <WindowWrapper>
      <Window>
        <h1>Content</h1>
      </Window>
    </WindowWrapper>
  ))
  .add('frameless', () => (
    <WindowWrapper>
      <Window frameless><h1>Content</h1></Window>
    </WindowWrapper>
  ))
  .add('padding', () => (
    <WindowWrapper>
      <Window padding='20px'><h1>Content</h1></Window>
    </WindowWrapper>
  ))
  .add('frameless with padding', () => (
    <WindowWrapper>
      <Window padding='20px' frameless><h1>Content</h1></Window>
    </WindowWrapper>
  ))
  .add('maxWidth', () => (
    <WindowWrapper>
      <Window width='300px'>
        <p>Content</p>
      </Window>
    </WindowWrapper>
  ))
  .add('margin', () => (
    <WindowWrapper>
      <Window width='100px' margin='50px'>
        <p>Content</p>
      </Window>
      <Window width='200px'><p>Content 2</p></Window>
    </WindowWrapper>
  ))
  .add('allowOverflow', () => (
    <WindowWrapper>
      <Window allowOverflow width='800px'>
        {
          [1, 2, 3, 4, 5, 6, 7, 8, 9].map(() => {
            return <h1>Content</h1>
          })
        }
      </Window>
    </WindowWrapper>
  ))

storiesOf('WindowHeader', module)
  .add('default', () => (
    <WindowWrapper>
      <Window>
        <WindowHeader>
          Title
        </WindowHeader>
      </Window>
    </WindowWrapper>
  ))

storiesOf('Popup', module)
  .add('default', () => (
    <WindowWrapper>
      <Window>
        <Popup>
          <p>Content</p>
          <p>More Content   </p>
        </Popup>
      </Window>
    </WindowWrapper>
  ))
