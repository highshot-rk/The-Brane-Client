import React from 'react'
import { storiesOf } from '@storybook/react'

import { SidebarMenu, SidebarHeader } from 'elements/layout'
import PropertySelector from 'components/PropertySelector'
import Sidebar from 'components/Sidebar'
import MinimalSearch from 'components/MinimalSearch'
import SortDirectionToggle from 'components/SortDirectionToggle'
import { SORT_DESCENDING, SORT_ASCENDING, SORT_DEFAULT } from 'utils/constants'
import Statistics from 'components/Statistics'
import { PropertyFilters } from 'containers/PropertySidebar'
import NavigationBottomBar from 'components/NavigationBottomBar'
import Property from 'components/PropertySelector/Property'
import { PropertyDetails } from 'containers/PropertyDetails'

storiesOf('SidebarMenu', module)
  .add('default', () => (
    <SidebarMenu width={'250px'} />
  ))
  .add('autoHeight', () => (
    <SidebarMenu width={'250px'} autoHeight>
      <p>Content...</p>
    </SidebarMenu>
  ))
  .add('custom background', () => (
    <SidebarMenu width={'250px'} background={'#DDD'} />
  ))

storiesOf('SidebarHeader', module)
  .add('default', () => (
    <SidebarMenu width={'250px'}>
      <SidebarHeader>
        Content...
      </SidebarHeader>
    </SidebarMenu>
  ))

const properties = [
  { _id: '0', title: 'YoY Revenue Growth', color: '#FF78CB', cluster: 'Science' },
  { _id: '1', title: 'Amount raised', color: '#51E898', cluster: 'Science' },
  { _id: '2', title: '# of Employees', color: '#9c4fe8', cluster: 'Technology' },
]

storiesOf('PropertySelector', module)
  .add('default', () => (
    <SidebarMenu width={'250px'}>
      <PropertySelector available={properties} active={[]} />
    </SidebarMenu>
  ))
  .add('selected', () => (
    <SidebarMenu width={'250px'}>
      <PropertySelector available={properties} active={properties.slice(1, 2).map(property => ({ ...property, sortDirection: SORT_ASCENDING }))} />
    </SidebarMenu>
  ))

function Wrapper ({ children }) {
  return (
    <SidebarMenu width={'250px'} style={{ padding: '20px 0' }}>
      {children}
    </SidebarMenu>
  )
}

storiesOf('Property', module)
  .add('default', () => (
    <Wrapper>
      <Property title={'Speed'} color={'#248eff'} />
    </Wrapper>
  ))
  .add('active', () => (
    <Wrapper>
      <Property active title={'Speed'} color={'#248eff'} />
      <Property active title={'Speed'} color={'#248eff'} />
      <Property active title={'Speed'} color={'#248eff'} />
    </Wrapper>
  ))
  .add('expanded', () => (
    <Wrapper>
      <Property active title={'Speed'} color={'#248eff'} />
      <Property active title={'Speed'} expanded color={'#248eff'} />
      <Property active title={'Speed'} color={'#248eff'} />
    </Wrapper>
  ))
  .add('sort directions', () => (
    <Wrapper>
      <Property active sortDirection={SORT_ASCENDING} title={'Ascending'} color={'#248eff'} />
      <Property active sortDirection={SORT_DESCENDING} title={'Descending'} color={'#248eff'} />
      <Property active sortDirection={SORT_DEFAULT} title={'Default'} color={'#248eff'} />
    </Wrapper>
  ))
  .add('cluster', () => (
    <Wrapper>
      <Property title={'Science'} isCluster />
    </Wrapper>
  ))
  .add('active cluster', () => (
    <Wrapper>
      <Property active title={'Science'} isCluster />
    </Wrapper>
  ))

const wrapperStyle = {
  width: '100vw',
  height: '100vh',
  position: 'absolute',
  left: '0',
}
storiesOf('Sidebar', module)
  .add('default', () => (
    <div style={wrapperStyle}>
      <Sidebar />
    </div>
  ))
  .add('selected', () => (
    <div style={wrapperStyle}>
      <Sidebar active='filter' />
    </div>
  ))
  .add('highlighted', () => (
    <div style={wrapperStyle}>
      <Sidebar highlighted='properties' />
    </div>
  ))

storiesOf('MinimalSearch', module)
  .add('default', () => (
    <SidebarMenu width={'250px'} >
      <MinimalSearch />
    </SidebarMenu>
  ))
  .add('icon', () => (
    <SidebarMenu width={'250px'} >
      <MinimalSearch icon />
    </SidebarMenu>
  ))
  .add('icon with wrapped border', () => (
    <SidebarMenu width={'250px'} style={{ paddingTop: 50 }}>
      <MinimalSearch icon wrappedBorder />
    </SidebarMenu>
  ))

storiesOf('SortDirectionToggle', module)
  .add('default', () => (
    <SidebarMenu width={'280px'}>
      <SortDirectionToggle />
    </SidebarMenu>
  ))
  .add('Descending', () => (
    <SidebarMenu width={'280px'}>
      <SortDirectionToggle selected={SORT_DESCENDING} />
    </SidebarMenu>
  ))
  .add('Ascending', () => (
    <SidebarMenu width={'280px'}>
      <SortDirectionToggle selected={SORT_ASCENDING} />
    </SidebarMenu>
  ))
  .add('Default Direction', () => (
    <SidebarMenu width={'280px'}>
      <SortDirectionToggle selected={SORT_DEFAULT} />
    </SidebarMenu>
  ))

storiesOf('PropertyDetails', module)
  .add('default', () => (
    <SidebarMenu width={'280px'}>
      <PropertyDetails values={[ 'One', 'Two' ]} selectedValues={[]} />
    </SidebarMenu>
  ))
  .add('some selected', () => (
    <SidebarMenu width={'280px'}>
      <PropertyDetails values={['One', 'Two']} selectedValues={['Two']} />
    </SidebarMenu>
  ))
  .add('all selected', () => (
    <SidebarMenu width={'280px'}>
      <PropertyDetails values={['One', 'Two']} selectedValues={['One', 'Two']} />
    </SidebarMenu>
  ))

const statistics = [
  {
    propertyTitle: 'YoY RG',
    'n': 20,
    'mean': 20,
    'median': 20,
    'standardDeviation': 20,
    'max': 20,
    'min': 20,
    'sum': 20,
  },
  {
    propertyTitle: 'Amount raised',
    'n': 50,
    'mean': 7.666666666666667,
    'median': 0.12,
    'standardDeviation': 4.898979485566356,
    'max': 0.25,
    'min': -0.3,
    'sum': 0.08,
  },
]

storiesOf('Statistics', module)
  .add('default', () => (
    <SidebarMenu width={'280px'}>
      <Statistics statistics={statistics.slice(0, 1)} />
    </SidebarMenu>
  ))
  .add('multiple', () => (
    <SidebarMenu width={'280px'}>
      <Statistics statistics={statistics} />
    </SidebarMenu>
  ))

storiesOf('PropertyFilters', module)
  .add('default', () => (
    <PropertyFilters panelVisible availableProperties={properties} activeProperties={[]} statistics={[]} />
  ))
  .add('Selected', () => (
    <PropertyFilters
      panelVisible
      activeProperties={properties.slice(0, 2)}
      availableProperties={properties.slice(2, properties.length)}
      statistics={statistics}
      tagFilters={[]}
    />
  ))
  .add('ActiveProperties', () => (
    <PropertyFilters
      open
      activeProperties={properties.slice(0, 2)}
      availableProperties={properties.slice(2, properties.length)}
      statistics={statistics}
      tagFilters={[]}
    />
  ))
  .add('ActiveProperties With ActiveFilters', () => (
    <PropertyFilters
      open
      activeProperties={properties.slice(0, 2)}
      availableProperties={properties.slice(2, properties.length)}
      statistics={statistics}
      tagFilters={[{}]}
    />
  ))

storiesOf('NavigationBottomBar', module)
  .add('default', () => (
    <NavigationBottomBar zoomLevel='100%' />
  ))
  .add('all orbits locked', () => (
    <NavigationBottomBar zoomLevel='100%' allOrbitsLocked />
  ))
