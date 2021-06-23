import React, { useState } from 'react'
import { AsyncResolver, DebouncePropagator } from 'reenhance-components'
import fetch from 'isomorphic-fetch'
import { Container, Tag } from './elements'
import { CircularProgress } from '@material-ui/core'

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function YagoInputTag (props) {
  const [query, setQuery] = useState()
  const [focus, setFocus] = useState(props.query.length === 0)
  const [tags, setTags] = useState(props.tags)
  const [loading, setLoading] = useState(true)

  const removeTags = indexToRemove => {
    setTags([...tags.filter((_, index) => index !== indexToRemove)])
    props.removeTag(indexToRemove)
  }

  const addTags = event => {
    try {
      setTags([...tags, event])
      props.addTag(event)
      setQuery('')
    } catch (e) {
    }
  }

  const addTagEnter = event => {
    try {
      setTags([...tags, event.target.value])
      props.addTag(event.target.value)
      setQuery('')
    } catch (e) {
    }
  }

  const queryToUrl =
        query => {
          switch (props.question) {
            case 'education':
              return `https://yago-api.herokuapp.com/school/${query}`
            case 'academic':
              return `https://yago-api.herokuapp.com/discipline/${query}`
            case 'organization':
              return `https://yago-api.herokuapp.com/organization/${query}`
            case 'occupation':
              return `https://yago-api.herokuapp.com/occupation/${query}`
          }
        }

  let asyncFetch = ({ query }) => fetch(queryToUrl(query.toLowerCase())).then(async res => {
    const data = await res.json()
    let result = []
    for (var i = 0; i < 10; i++) {
      try {
        if (props.question === 'education') {
          const newData = capitalizeFirstLetter(data[i].school)
          result.push(newData)
        } else if (props.question === 'academic') {
          const newData = capitalizeFirstLetter(data[i].discipline)
          result.push(newData)
        } else if (props.question === 'organization') {
          const newData = capitalizeFirstLetter(data[i].organization)
          result.push(newData)
        } else if (props.question === 'occupation') {
          const newData = capitalizeFirstLetter(data[i].occupation)
          result.push(newData)
        }
      } catch (e) {
        break
      }
    }
    setLoading(false)
    return result
  })

  const SuggestAsyncResolver = AsyncResolver('query', [])
  const SuggestDebounce = DebouncePropagator({ query: '' })

  const handleClick = (str) => {
    onChange(str)
    setFocus(true)
    addTags(str)
  }

  const Suggests = ({ query }) => (
    <SuggestAsyncResolver query={query} subject={asyncFetch}>
      {props => (
        <ul style={{ listStyleType: 'none' }} className={focus ? 'focus' : null}>
          {props && props.length > 0 ? props.map(str => (
            <li key={str}><button onClick={() => handleClick(str)}>{str}</button></li>
          )) : loading ? <CircularProgress /> : <div />}
        </ul>
      )}
    </SuggestAsyncResolver>
  )

  let onChange = (e) => {
    // Change local state
    setQuery(e)
    setFocus(false)

    // Change question parameters for parent component
    props.removeTag(e)
  }

  let onKeyPress = (e) => {
    setLoading(true)
  }

  return (
    <Container>
      <Tag>
        <div className='tags-input'>
          <ul id='tags'>
            {tags.map((tag, index) => (
              <li key={index} className='tag'>
                <span className='tag-close-icon'
                  onClick={() => removeTags(index)} > x</span>
                <span className='tag-title'>{tag}</span>
              </li>
            ))}
          </ul>
          <input
            className='tag-input'
            type='text'
            onKeyUp={event => event.key === 'Enter' ? addTagEnter(event) : null}
            onKeyPress={e => onKeyPress(e)}
            value={query}
            placeholder={props.placeholder}
            onChange={e => onChange(e.target.value)} />
          <SuggestDebounce
            time={300}
            query={query}
          >
            {({ query, state }) => (
              <div>
                {query && <Suggests query={query} url={props.url} />}
              </div>
            )}
          </SuggestDebounce>
        </div>
      </Tag>
    </Container>
  )
}
