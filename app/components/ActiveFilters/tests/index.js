import { mount } from 'enzyme'
import React from 'react'
import ActiveFilters from '../'
import expect from 'expect'
import * as e from '../elements'

jest.mock('utils/tags', () => ({
  allUniqueTags: (tags) => tags,
  clusterKeyToTagPath: key => ([{
    _key: key,
    title: 'a',
  }]),
}))

describe('<ActiveFilters />', () => {
  it('Should show filters', () => {
    let wrapper = mount(
      <ActiveFilters
        tagFilters={[
          { _key: '1', title: 'family' },
          { _key: '2', title: 'group' },
          { _key: '3', title: 'type' },
        ]}
        getCount={() => 1}
      />
    )

    expect(wrapper.find(e.FilterList).text())
      .toEqual('family, group, type')
  })
})
