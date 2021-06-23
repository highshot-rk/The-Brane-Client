import React from 'react'
import locale from './icons/locale.png'
import call from './icons/call.png'
import person from './icons/person.png'
import commentPng from './icons/comment.png'
import neilProfile from './icons/neil-profile.jpg'
import * as e from './elements'

const Publication = () =>
  (<e.Publication>
    <section style={{ marginTop: 0, color: '#565656' }}>
      <p>“Great article, but it lacks the references in Robotics to support its primary hypothesis”</p>
      <p>Explanation: Lorem ipsum dolor sit amet, consectetur adipiscing elit <a>[1]</a>, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua <a>[5]</a>.</p>
      <p style={{ display: 'inline-flex' }} ><img src={commentPng} />&nbsp;2 comments</p>
      <e.AuthorCard>
        <img src={neilProfile} />
        <section>
          <p>2 Minutes Ago</p>
          <span>Submitted by <strong>Neil </strong></span>
          <p><img src={locale} /> 5600</p>
          <p><img src={person} /> 890</p>
          <p><img src={call} /> 600</p>
        </section>
      </e.AuthorCard>
    </section>
  </e.Publication>)

export default Publication
