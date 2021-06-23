import React from 'react'
import { Tag, TagsInput } from './elements'

export const InputTag = props => {
  const removeTags = indexToRemove => {
    props.removeTag(indexToRemove)
  }

  const addTags = event => {
    if (event.target.value !== '') {
      props.addTag(event.target.value)
      event.target.value = ''
    }
  }

  return (
    <Tag>
      <TagsInput>
        <ul id='tags'>
          {props.tags.map((tag, index) => (
            <li key={index} className='tag'>
              <span className='tag-close-icon'
                onClick={() => removeTags(index)} > x</span>
              <span className='tag-title'>{tag}</span>
            </li>
          ))}
        </ul>
        <input
          type='text'
          onKeyUp={event => event.key === 'Enter' ? addTags(event) : null}
          placeholder='Enter' />
      </TagsInput>
    </Tag>
  )
}
