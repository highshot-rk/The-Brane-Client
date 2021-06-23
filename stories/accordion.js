import React from 'react'
import { storiesOf } from '@storybook/react'
import { SidebarMenu } from 'elements/layout'
import Accordion from 'components/Accordion'

function Wrapper ({ children }) {
  return (
    <SidebarMenu width={'250px'} style={{ padding: '20px 0' }}>
      {children}
    </SidebarMenu>
  )
}

storiesOf('Accordion', module)
  .add('default', () => (
    <Wrapper>
      <Accordion title='test'>
        Content
      </Accordion>
    </Wrapper>
  ))
  .add('open', () => (
    <Wrapper>
      <Accordion open title='test'>
        Content
      </Accordion>
    </Wrapper>
  ))
  .add('no content', () => (
    <Wrapper>
      <Accordion title='test' />
    </Wrapper>
  ))
