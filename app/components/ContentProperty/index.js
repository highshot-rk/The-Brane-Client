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
  Span,
  CircleRed,
  Button,
  ButtonGroup,
  Mark,
  Available,
  Selected,
  Main,
  Input,
  AvailableTap,
  SelectedTap,
  SearchWrap,
} from './element'
import Icon from 'components/Icon'

class ContentProperty extends Component {
  static propTypes = {
    back: PropTypes.func,
    done: PropTypes.func,
    data: PropTypes.object,
    history: PropTypes.object,
    specifyNode: PropTypes.array,
    specifyTopicsNumber: PropTypes.number,
    specifyClusterNumber: PropTypes.number,
  }

  constructor (props) {
    super(props)
    this.state = {
      specifyNode: [],
      specifyNodeData: true,
      searchtext: '',
      allTopics: true,
    }
  }
  componentWillMount () {
    const { specifyNode } = this.props
    this.setState({ specifyNode })
  }
  allToggle = (value) => {
    const { data } = this.props
    let specifyNode = []
    if (value) {
      specifyNode = Object.keys(data)
    }
    this.setState({ specifyNode })
  }
  eachToggle = (key, value) => {
    const { specifyNode } = this.state
    let temp = specifyNode
    const { history } = this.props
    if (value) {
      if (history.length - 1 === specifyNode.length) {
        temp = []
      }
      temp.push(key)
    } else {
      temp = specifyNode.filter(function (value) {
        return value !== key
      })
    }
    this.setState({ specifyNode: temp })
  }
  submitdata = () => {
    const { specifyNode } = this.state
    this.props.done(specifyNode)
    this.props.back('main')
  }
  searchChange = (e) => {
    this.setState({ searchtext: e.target.value })
  }
  render () {
    const { searchtext, specifyNode } = this.state
    const { back, data, specifyClusterNumber, specifyTopicsNumber, history } = this.props
    let allTopics = false
    if (specifyNode.length === history.length - 1) {
      allTopics = true
    }

    return (
      <div>
        <Title>Advanced Export</Title>
        <Content>
          <SubTitle>Export from</SubTitle>
          <Main>
            <AvailableTap>
              <TableTitle>Avaliable</TableTitle>
            </AvailableTap>
            <SelectedTap>
              <TableTitle>Selected</TableTitle>
            </SelectedTap>
          </Main>
          <SearchWrap>
            <Icon width={26} height={26} name='search' style={{ float: 'left' }} />
            <Input type='text' placeholder='Search' onChange={this.searchChange} />
          </SearchWrap>
          <Main>
            <Available>
              <Row margin={'10px'}>
                {
                  (allTopics) ? (<CirclePlus onClick={() => this.allToggle(false)}><Mark>✓</Mark></CirclePlus>) : (<CircleMin onClick={() => this.allToggle(true)} />)
                }
                <div>All ({history.length - 1} nodes, {specifyClusterNumber} clusters and {specifyTopicsNumber} topics)</div>
              </Row>
              {
                Object.keys(data).map((val, key) => (
                  (data[val].name.indexOf(searchtext) !== -1) &&
                  (<Row key={key} margin={'10px'}>
                    {
                      (!allTopics && specifyNode.includes(val)) ? (<CirclePlus onClick={() => this.eachToggle(val, false)}><Mark>✓</Mark></CirclePlus>) : (<CircleMin onClick={() => this.eachToggle(val, true)}><Span>+</Span></CircleMin>)
                    }
                    <div>{data[val].name}({data[val].clusterNumber} cluster,{data[val].topicsNumber} topics)</div>
                  </Row>)
                ))
              }
            </Available>
            <Selected>
              { (allTopics) &&
                (<Row>
                  <CircleRed onClick={() => this.allToggle(false)}><Span>-</Span></CircleRed>
                  <div>All ({history.length - 1} nodes, {specifyClusterNumber} clusters and {specifyTopicsNumber} topics)</div>
                </Row>)
              }
              {
                (!allTopics) && (specifyNode.map((val, key) => (
                  <Row key={key} margin={'10px'}>
                    <CircleRed onClick={() => this.eachToggle(val, false)}><Span>-</Span></CircleRed>
                    <div>{data[val].name}({data[val].clusterNumber} cluster,{data[val].topicsNumber} topics)</div>
                  </Row>)
                ))
              }
            </Selected>
          </Main>
        </Content>
        <ButtonGroup>
          <Button onClick={this.submitdata}>{`DONE`}</Button>
          <Cancel onClick={() => back('main')}>{` Back`}</Cancel>
        </ButtonGroup>
      </div>
    )
  }
}

export default ContentProperty
