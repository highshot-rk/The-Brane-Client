import React from 'react'
import locale from './icons/locale.png'
import call from './icons/call.png'
import person from './icons/person.png'
import commentPng from './icons/comment.png'
import neilProfile from './icons/neil-profile.jpg'
import { Vote } from './icons'
import * as e from './elements'

const EditPost = ({ upvote, downvote }) =>
  (<e.EditPost>
    <div className='edit-post-container'>
      <Vote upvote={upvote} downvote={downvote} />
    </div>
    <section>
      <p><strong>Node Definition</strong> changed to “Lorem ipsum dolor sit amet, consectetur adipiscing dolore magna aliqua.” </p>
      <a><img src={commentPng} />&nbsp;2 comments</a>
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
  </e.EditPost>)

export default EditPost
