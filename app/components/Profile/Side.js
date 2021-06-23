import React, { Component } from 'react'
import { Tags, Stats, SideBar, MetaData, SocialList } from './elements'
import Edit from './Edit'
import locationIcon from './icons/location.svg'
import twitterIcon from './icons/twitter.svg'
import linkedInIcon from './icons/linkedin.svg'
import academiaIcon from './icons/academia.svg'
import researchGateIcon from './icons/research-gate.svg'
import educationIcon from './icons/university_hat.svg'
import { featureEnabled } from 'utils/features'

export default class Side extends Component {
  render () {
    const {
      firstName,
      lastName,
      following,
      followers,
      tags,
      education,
      location,
      shortDescription,
      description,
      editing,
      editData,
      updateValue,
      linkedIn,
      twitter,
      academia,
      researchGate,
    } = this.props

    if (!featureEnabled('profileSidebar')) {
      return (
        <SideBar>
          <h3>{firstName} {lastName}</h3>
        </SideBar>
      )
    }

    if (editing) {
      return (
        <Edit
          data={editData}
          updateValue={updateValue}
        />
      )
    }

    return (
      <SideBar>
        <h3>{firstName} {lastName}</h3>
        <p>{shortDescription}</p>
        <Stats>
          <strong>{following}</strong> Following
          <strong>{followers}</strong> Followers
        </Stats>
        {tags.length ? <Tags>
          {tags.map(tag => <li key={tag}>{tag}</li>)}
        </Tags> : null
        }
        {description && <p>{description}</p>}
        {education.map(name => <MetaData key={name}><img src={educationIcon} /> {name}</MetaData>)}
        {location &&
          <MetaData><img src={locationIcon} /> {location}</MetaData>
        }
        <SocialList>
          {linkedIn && <a target='_blank' href={linkedIn}><img src={linkedInIcon} /></a>}
          {twitter && <a target='_blank' href={twitter}><img src={twitterIcon} /></a>}
          {academia && <a target='_blank' href={academia}><img src={academiaIcon} /></a>}
          {researchGate && <a target='_blank' href={researchGate}><img src={researchGateIcon} /></a>}
        </SocialList>
      </SideBar>
    )
  }
}
