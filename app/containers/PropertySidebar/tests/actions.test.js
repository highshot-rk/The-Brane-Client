import expect from 'expect'
import {
  activatePropertyFilter, queryChanged, deactivateProperty, addTopicProperties, setSortDirection,
} from '../actions'
import {
  ACTIVATE_PROPERTY, QUERY_CHANGED, DEACTIVATE_PROPERTY, ADD_TOPIC_PROPERTIES, SET_SORT_DIRECTION,
} from '../constants'

describe('PropertyFilters actions', () => {
  it('activePropertyFilter', () => {
    const expected = {
      type: ACTIVATE_PROPERTY,
      payload: {
        _id: '1',
        title: 'Prop',
        color: '#123',
        cluster: 'Science',
      },
    }
    expect(activatePropertyFilter({
      _id: '1',
      title: 'Prop',
      color: '#123',
      cluster: 'Science',
    })).toEqual(expected)
  })
  it('queryChanged', () => {
    const expected = {
      type: QUERY_CHANGED,
      payload: 'query',
    }

    expect(queryChanged('query')).toEqual(expected)
  })
  it('deactivateProeprty', () => {
    const expected = {
      type: DEACTIVATE_PROPERTY,
      payload: {
        _id: '1',
        cluster: 'Science',
      },
    }

    expect(deactivateProperty('1', 'Science')).toEqual(expected)
  })
  it('addTopicProperties', () => {
    const expected = {
      type: ADD_TOPIC_PROPERTIES,
      payload: [{ _id: '1', title: 'Prop' }],
    }

    expect(addTopicProperties([{ _id: '1', title: 'Prop' }])).toEqual(expected)
  })
  it('setSortDirection', () => {
    const expected = {
      type: SET_SORT_DIRECTION,
      payload: {
        propertyId: '1',
        direction: 'up',
      },
    }

    expect(setSortDirection('1', 'up')).toEqual(expected)
  })
})
