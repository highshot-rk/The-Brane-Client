import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  Title,
  Content,
  SubTitle,
  TableTitle,
  Cancel,
  CirclePlus,
  Row,
  CircleMin,
  Plus,
  Minus,
  Mark,
  CircleRed,
  Button,
  Property,
  Cluster,
  PropertyDiv,
  PropertyTitle,
  Main,
  Available,
  Selected,
  Input,
  AvailableTap,
  SelectedTap,
  SearchWrap,
} from './element'
import Icon from 'components/Icon'
import DropMenu from './DropMenu'

class ExportProperty extends Component {
  static propTypes = {
    back: PropTypes.func,
    done: PropTypes.func,
    allCluster: PropTypes.object,
    selectedCluster: PropTypes.object,
    allClusterKey: PropTypes.array,
  }

  constructor (props) {
    super(props)
    this.state = {
      metaData: ['_id', 'title', 'title2', 'title3', 'description', 'reference'],
      searchtext: '',
      active: '',
      allCluster: {},
      selectedCluster: {},
      prestine: true,
    }
  }
  componentWillMount () {
    const { allCluster, allClusterKey, selectedCluster } = this.props
    if (this.state.prestine) {
      this.setState({
        selectedCluster,
        allCluster,
        allClusterKey,
        active: allClusterKey[0],
        prestine: false,
      })
    }
  }

  componentWillUnmount () {
    this.setState({ prestine: true })
  }

  submitdata = () => {
    const { selectedCluster, allClusterKey } = this.state
    const { done, back } = this.props
    const data = {
      allClusterKey: allClusterKey,
      selectedCluster: selectedCluster,
    }
    done(data)
    back('main')
  }
  clusterToggle =(key, val) => {
    const { allClusterKey } = this.state
    let temp = allClusterKey
    if (val) {
      temp.push(key)
    } else {
      temp = allClusterKey.filter(function (value) {
        return value !== key
      })
    }
    this.setState({ allClusterKey: temp })
  }
  metapropertytoggle = (key, title, val) => {
    const { selectedCluster, allClusterKey } = this.state
    let temp = selectedCluster
    if (val) {
      if (temp[title].metaData.length === 6) {
        temp[title].metaData = []
      }
      if (selectedCluster[title].metaData.includes(key)) {
        allClusterKey.forEach((each) => {
          const meTatemp = selectedCluster[each].metaData.filter(function (filtered) {
            return filtered !== key
          })
          temp[each].metaData = meTatemp
        })
      }
      temp[title].metaData.push(key)
    } else {
      const metatemp = temp[title].metaData.filter(function (value) {
        return value !== key
      })
      temp[title].metaData = metatemp
    }
    this.setState({ selectedCluster: temp })
  }
  metaAllpropertytoggle = (title, val) => {
    const { selectedCluster, allCluster } = this.state
    if (val) {
      selectedCluster[title].metaData = allCluster[title].metaData
    } else {
      selectedCluster[title].metaData = []
    }
    this.setState({ selectedCluster })
  }
  propertyAlltoggle = (title, val) => {
    const { selectedCluster, allCluster } = this.state
    if (val) {
      selectedCluster[title].property = allCluster[title].property
    } else {
      selectedCluster[title].property = []
    }
    this.setState({ selectedCluster })
  }
  propertytoggle = (key, title, val) => {
    const { selectedCluster, allCluster } = this.state
    let temp = selectedCluster[title].property
    if (val) {
      if (temp.length === allCluster[title].property.length) {
        temp = []
      }
      temp.push(key)
    } else {
      const propertytemp = temp.filter(function (value) {
        return value !== key
      })
      temp = propertytemp
    }
    selectedCluster[title].property = temp
    this.setState({ selectedCluster })
  }
  setActive = (value) => {
    this.setState({ active: value })
  }
  searchChange = (e) => {
    this.setState({ searchtext: e.target.value })
  }
  allClusterstoggle = (key, value) => {
    const { selectedCluster, allClusterKey } = this.state
    let temp = selectedCluster
    allClusterKey.forEach((each) => {
      if (value) {
        if (!temp[each].metaData.includes(key)) {
          temp[each].metaData.push(key)
        }
      } else {
        const metatemp = temp[each].metaData.filter(function (filtered) {
          return filtered !== key
        })
        temp[each].metaData = metatemp
      }
    })
    this.setState({ selectedCluster: temp })
  }
  render () {
    const { allClusterKey, active, selectedCluster, allCluster, searchtext } = this.state
    const { back } = this.props
    let activeTitle = active
    let metaAll = false
    let propertyAll = false
    if (selectedCluster[activeTitle].metaData.length === 6) {
      metaAll = true
    }
    if (selectedCluster[activeTitle].property.length === allCluster[activeTitle].property.length) {
      propertyAll = true
    }
    if (Object.keys(selectedCluster).length > 0) {
      return (
        <div>
          <Title>Advanced Export</Title>
          <Content>
            <SubTitle>Content to export</SubTitle>
            <Main>
              <AvailableTap>
                <TableTitle>Avaliable</TableTitle>
              </AvailableTap>
              <SelectedTap>
                <TableTitle>Selected</TableTitle>
              </SelectedTap>
            </Main>
            <SearchWrap>
              <Icon width={30} height={30} name='search' style={{ float: 'left', marginTop: '7px' }} />
              <Input type='text' placeholder='Search' onChange={(e) => this.searchChange(e)} />
              <DropMenu
                searchtext={searchtext}
                allCluster={allCluster}
                selectedCluster={selectedCluster}
                allClusterKey={allClusterKey}
                metapropertytoggle={this.metapropertytoggle}
                allClusterstoggle={this.allClusterstoggle}
              />
            </SearchWrap>
            <Main>
              <Available>
                <Row>
                  <Cluster>
                    {
                      Object.keys(allCluster).map((val, key) => (
                        ((val !== activeTitle) ? (<Row className='p-2' key={key} color={'white'} onClick={() => this.setActive(val)} >
                          {
                            (allClusterKey.includes(val)) ? (<CirclePlus onClick={() => this.clusterToggle(val, false)}><Mark>✓</Mark></CirclePlus>) : (<CircleMin onClick={() => this.clusterToggle(val, true)}><Plus>+</Plus></CircleMin>)
                          }
                          <div>{allCluster[val].title}{console.log(allCluster[val])} ({allCluster[val].number})</div>
                        </Row>) : (<Row key={key} padding={'1rem'} color={'rgba(196, 196, 196, 0.8);'} onClick={() => this.setActive(val)} >
                          {
                            (allClusterKey.includes(val)) ? (<CirclePlus onClick={() => this.clusterToggle(val, false)}><Mark>✓</Mark></CirclePlus>) : (<CircleMin onClick={() => this.clusterToggle(val, true)}><Plus>+</Plus></CircleMin>)
                          }
                          <div>{allCluster[val].title} ({allCluster[val].number})</div>
                        </Row>))
                      ))
                    }
                  </Cluster>
                  <Property>
                    <TableTitle>MetaData</TableTitle>
                    <Row margin={'10px'}>
                      {
                        (metaAll) ? (<CirclePlus onClick={() => this.metaAllpropertytoggle(activeTitle, false)}><Mark>✓</Mark></CirclePlus>) : (<CircleMin onClick={() => this.metaAllpropertytoggle(activeTitle, true)}><Plus>+</Plus
                        ></CircleMin>)
                      }
                      <div>All</div>
                    </Row>
                    {
                      allCluster[activeTitle].metaData.map((val, key) => (
                        <Row key={key} margin={'10px'}>
                          {
                            ((!metaAll) && (selectedCluster[activeTitle].metaData.includes(val))) ? (<CirclePlus onClick={() => this.metapropertytoggle(val, activeTitle, false)}><Mark>✓</Mark></CirclePlus>) : (<CircleMin onClick={() => this.metapropertytoggle(val, activeTitle, true)}><Plus>+</Plus></CircleMin>)
                          }
                          <div>{val}</div>
                        </Row>
                      ))
                    }
                    <TableTitle>Property</TableTitle>
                    <Row margin={'10px'}>
                      {
                        (propertyAll) ? (<CirclePlus onClick={() => this.propertyAlltoggle(activeTitle, false)}><Mark>✓</Mark></CirclePlus>) : (<CircleMin onClick={() => this.propertyAlltoggle(activeTitle, true)}><Plus>+</Plus></CircleMin>)
                      }
                      <div>All</div>
                    </Row>
                    {
                      allCluster[activeTitle].property.map((val, key) => (
                        <Row key={key} margin={'10px'}>
                          {
                            ((!propertyAll) && (selectedCluster[activeTitle].property.includes(val))) ? (<CirclePlus onClick={() => this.propertytoggle(val, activeTitle, false)}><Mark>✓</Mark></CirclePlus>) : (<CircleMin onClick={() => this.propertytoggle(val, activeTitle, true)}><Plus>+</Plus></CircleMin>)
                          }
                          <div>{val}</div>
                        </Row>
                      ))
                    }
                  </Property>
                </Row>
              </Available>
              <Selected>
                {
                  allClusterKey.map((val, key) => (
                    <div key={key}>
                      <Row margin={'10px'}>
                        <CircleRed onClick={() => this.clusterToggle(val, false)}><Minus>-</Minus></CircleRed>
                        <div>{allCluster[val].title}</div>
                      </Row>
                      <Row>
                        <PropertyDiv>
                          {
                            (selectedCluster[val].metaData.length === 0) ? (<div />) : (<PropertyTitle>Metadata</PropertyTitle>)
                          }
                          {
                            (selectedCluster[val].metaData.length === allCluster[val].metaData.length) && (
                              <Row>
                                <CircleRed onClick={() => this.metaAllpropertytoggle(val, false)}><Minus>-</Minus></CircleRed>
                                <div>All</div>
                              </Row>
                            )
                          }
                          {
                            (selectedCluster[val].metaData.length !== allCluster[val].metaData.length) && selectedCluster[val].metaData.map((value, index) => (
                              <Row key={index} >
                                <CircleRed onClick={() => this.metapropertytoggle(value, val, false)}><Minus>-</Minus></CircleRed>
                                <div>{value}</div>
                              </Row>
                            ))
                          }
                        </PropertyDiv>
                        <PropertyDiv>
                          {
                            (selectedCluster[val].property.length === 0) ? (<div />) : (<PropertyTitle>Properties</PropertyTitle>)
                          }
                          {
                            (selectedCluster[val].property.length === allCluster[val].property.length) && (
                              <Row>
                                <CircleRed onClick={() => this.propertyAlltoggle(val, false)}><Minus>-</Minus></CircleRed>
                                <div>All</div>
                              </Row>
                            )
                          }
                          {
                            (selectedCluster[val].property.length !== allCluster[val].property.length) && selectedCluster[val].property.map((value, index) => (
                              <Row key={index} >
                                <CircleRed onClick={() => this.propertytoggle(value, val, false)}><Minus>-</Minus></CircleRed>
                                <div>{value}</div>
                              </Row>
                            ))
                          }
                        </PropertyDiv>
                      </Row>
                    </div>
                  )
                  )
                }
              </Selected>
            </Main>
          </Content>
          <div >
            <Button onClick={this.submitdata}>DONE</Button>
            <Cancel onClick={() => back('main')}><span>{'<'} </span>Back</Cancel>
          </div>
        </div>
      )
    } else {
      return (
        <div />
      )
    }
  }
}

export default ExportProperty
