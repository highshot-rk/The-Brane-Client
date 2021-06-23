import React from 'react'
import { storiesOf } from '@storybook/react'
import {
  Search,
} from 'containers/Search'

storiesOf('Search', module)
  .add('center', () => (
    <Search welcome results={[]} queries={[]} fixedPathSingleNodeView={{}} />
  ))
  .add('sidebar', () => (
    <Search panelVisible results={[]} activeQuery={0} queries={[{ query: '', id: null }]} fixedPathSingleNodeView={{}} />
  ))
  .add('query', () => (
    <Search panelVisible activeQuery={0} results={[{ _id: '1', title: 'gravity', count: 5 }]} queries={[{ query: 'gra', id: null }]} fixedPathSingleNodeView={{}} />
  ))
  .add('loading', () => (
    <Search loading panelVisible results={[]} activeQuery={0} queries={[{ query: 'gra', id: null }]} fixedPathSingleNodeView={{}} />
  ))
  .add('loading second query', () => (
    <Search loading panelVisible results={[]} activeQuery={1}
      queries={[{ query: 'gravity', id: '1' }, { query: '', id: null }]} fixedPathSingleNodeView={{}}
    />

  ))
