import React, { useState } from 'react'
import { AsyncResolver, DebouncePropagator } from 'reenhance-components'
import fetch from 'isomorphic-fetch'
import { Container } from './elements'
import { CircularProgress } from '@material-ui/core'

function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function YagoInput (props) {
  const [query, setQuery] = useState(props.query)
  const [focus, setFocus] = useState(props.query.length > 1)
  const [loading, setLoading] = useState(true)

  const queryToUrl =
  query => {
    switch (props.question) {
      case 'city':
        return `https://yago-api.herokuapp.com/city/${query}`
    }
  }

  let asyncFetch = ({ query }) => (
    fetch(queryToUrl(query.toLowerCase()))).then(async res => {
    const data = await res.json()
    let result = []
    for (var i = 0; i < 10; i++) {
      try {
        if (props.question === 'city') {
          const newData = capitalizeFirstLetter(data[i].location)
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
    props.onChange(e)
  }

  let onKeyPress = (e) => {
    setLoading(true)
  }

  return (
    <Container>
      <input value={query} placeholder={props.placeholder} onChange={e => onChange(e.target.value)} onKeyPress={e => onKeyPress(e)} />
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
    </Container>
  )
}
