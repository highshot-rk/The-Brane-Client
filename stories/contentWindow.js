import React from 'react'
import { storiesOf } from '@storybook/react'
import {
  NodePreviewWindowContainer,
} from 'containers/NodePreviewWindow'
import { LinkPreviewWindow } from 'containers/LinkPreviewWindow'

const node = {
  definition: 'test definition',
  title: 'Gravity',
  tagList: [],
}

function createVennIds (operator, count = 2) {
  const names = [
    'Gravity',
    'Science',
    'Technology',
    'Researchers',
  ]

  let result = []
  for (let i = 0; i < count; i++) {
    result.push({ _id: i, query: names[i], type: i === 0 ? null : operator })
  }

  return result
}

const longDefinition = 'description '.repeat(1000)

storiesOf('Node Content Window', module)
  .add('loading', () => (
    <NodePreviewWindowContainer
      nodePreviewWindow={{ loading: true, show: true, node, relatives: [] }}
    />
  ))
  .add('topic', () => (
    <NodePreviewWindowContainer nodePreviewWindow={{ show: true, node, relatives: [] }} />
  ))
  .add('cluster', () => (
    <NodePreviewWindowContainer nodePreviewWindow={{
      show: true,
      node: { ...node, _type: 'cluster' },
      relatives: [],
    }} />
  ))
  .add('long definition', () => (
    <NodePreviewWindowContainer nodePreviewWindow={{
      show: true,
      node: { ...node, definition: longDefinition },
      relatives: [],
    }} />
  ))
  .add('node with links', () => (
    <NodePreviewWindowContainer nodePreviewWindow={{
      show: true,
      node,
      relatives: [{}, {}, {}, {}],
    }} />
  ))
  .add('node with tags', () => (
    <NodePreviewWindowContainer nodePreviewWindow={{
      show: true,
      node: { ...node, tagList: [[{ _key: '0', title: 'Science' }]] },
      relatives: [],
    }} />
  ))
  .add('expandable window', () => (
    <NodePreviewWindowContainer nodePreviewWindow={{
      show: true,
      node: { ...node, _type: 'publication' },
      relatives: [],
    }} />
  ))
  .add('link sidebar', () => (
    <NodePreviewWindowContainer nodePreviewWindow={{
      show: true,
      node,
      showLinkSidebar: true,
      relatives: [{ title: 'Physical Phenomenon' }, { title: 'Theory of general relativity' }, { title: 'Science' }],
    }} />
  ))
  .add('two term venn diagram', () => (
    <NodePreviewWindowContainer nodePreviewWindow={{
      show: true,
      node: { ...node, vennIds: createVennIds('intersection') },
      relatives: [],
    }} />
  ))
  .add('venn window with long titles', () => (
    <NodePreviewWindowContainer nodePreviewWindow={{
      show: true,
      node: { ...node, vennIds: createVennIds('intersection').map(a => { a.query = `${a.query} `.repeat(10); return a }) },
      relatives: [],
    }} />
  ))

storiesOf('Link Content Window', module)
  .add('loading', () => (
    <LinkPreviewWindow linkPreviewWindow={{ show: true }} />
  ))
  .add('two links', () => (
    <LinkPreviewWindow linkPreviewWindow={{
      show: true,
      startNode: {
        title: 'Physical Phenomenon',
      },
      stopNode: {
        title: 'Gravity',
      },
      linkDetails: {
      },
    }} />
  ))
  .add('definition', () => (
    <LinkPreviewWindow linkPreviewWindow={{
      show: true,
      startNode: {
        title: 'The Brane',
      },
      stopNode: {
        title: 'Science',
      },
      linkDetails: {
        definition: 'Definition...',
      },
    }} />
  ))
  .add('link name', () => (
    <LinkPreviewWindow linkPreviewWindow={{
      show: true,
      startNode: {
        title: 'The Brane',
      },
      stopNode: {
        title: 'Science',
      },
      linkDetails: {
        name: 'includes',
      },
    }} />
  ))
  .add('link type', () => (
    <LinkPreviewWindow linkPreviewWindow={{
      show: true,
      startNode: {
        title: 'Sun',
      },
      stopNode: {
        title: 'Temperature',
      },
      linkDetails: {
        _type: 'property',
      },
    }} />
  ))
