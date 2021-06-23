import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ExportProperty from 'components/ExportProperty'
import ContentProperty from 'components/ContentProperty'
import CheckBox from 'components/SelectExportableCluster'
import { filterOneNode } from 'api/node'
import {
  Container,
  Wrapper,
  Window,
  Content,
  Title,
  SubTitle,
  SubWrapper,
  SubContent,
  Element,
  Input,
  ButtonWrapper,
  Button,
  Download,
  DownloadTitle,
  DownloadContent,
  DownloadButton,
  ExportWindow,
  ExportContent,
  ExportIcon,
  ManageButton,
  SubExport,
  DownFile,
  DownIcon,
  DownFileSuccess,
  DownIconSuccess,
} from './elements'

import './index.scss'
import { SUPPORTED_EXPORTABLE_FORMATS } from 'utils/constants'

class AdvanceDialog extends Component {
  static propTypes = {
    close: PropTypes.func,
    history: PropTypes.array,
    nodes: PropTypes.object,
    exportTopics: PropTypes.func,
    focusedId: PropTypes.string,
    progress: PropTypes.number,
  }

  constructor (props) {
    super(props)
    this.state = {
      setting: '',
      checked: 'current',
      selectedformats: ['CSV'],
      toggle: 'main',
      download: '',
      show: false,
      specifyNode: [],
      filteredData: {},
      currentNode: {},
      allCluster: {},
      selectedCluster: {},
      specifyTopicsNumber: 0,
      allClusterKey: [],
      currentCluster: {},
      currentClusterKey: [],
      selectedCurrentCluster: {},
      contentSet: false,
    }
  }

  async componentWillMount () {
    let { history, nodes, focusedId } = this.props
    let keys = ''
    for (var index = 1; index < history.length; index++) {
      if (index === 1) {
        keys = keys + history[index].split('/')[1]
      } else {
        keys = keys + '||' + history[index].split('/')[1]
      }
    }
    const data = await filterOneNode(keys)
    let allCluster = {}
    let specifyTopicsNumber = 0
    const specifyNode = Object.keys(data)

    Object.keys(data).forEach((val) => {
      data[val].clusterNumber = Object.keys(data[val]).length
      data[val].topicsNumber = 0
      data[val].name = nodes[val].title
      Object.keys(data[val]).forEach((value) => {
        if (data[val][value].property) {
          allCluster[value] = {
            property: data[val][value].property,
            title: data[val][value].topic[0].title,
            metaData: ['_id', 'title', 'title2', 'title3', 'definition', 'reference'],
            number: 0,
          }
        }
      })
      Object.values(data[val]).forEach((value) => {
        if (value.topic) {
          specifyTopicsNumber += value.topic.length
          data[val].topicsNumber += value.topic.length
        }
      })
    })
    Object.keys(data).forEach((val) => {
      Object.keys(data[val]).forEach((value) => {
        if (data[val][value].property) {
          allCluster[value].number += data[val][value].topic.length
        }
      })
    })

    let currentCluster = {}
    let currentNode = data[focusedId]
    Object.keys(currentNode).forEach((val) => {
      if (currentNode[val].property) {
        currentCluster[val] = {
          property: currentNode[val].property,
          title: currentNode[val].topic[0].title,
          metaData: ['_id', 'title', 'title2', 'title3', 'description', 'reference'],
          number: currentNode[val].topic.length,
        }
      }
    })

    currentNode.clusterNumber = Object.keys(currentNode).length - 3

    const selectedCluster = JSON.parse(JSON.stringify(allCluster))
    const selectedCurrentCluster = JSON.parse(JSON.stringify(currentCluster))
    this.setState({
      filteredData: data,
      currentNode,
      allCluster,
      selectedCluster,
      currentCluster,
      selectedCurrentCluster,
      currentClusterKey: Object.keys(currentCluster),
      specifyTopicsNumber: specifyTopicsNumber,
      specifyNode,
      allClusterKey: Object.keys(allCluster),
    })
  }

  sorter = (checkedItem) => {
    this.setState({ checked: checkedItem })
  }

  toggleFormat = (name) => {
    const { selectedformats } = this.state
    // if format exists remove it
    if (selectedformats.includes(name)) {
      const temp = [...selectedformats]
      const tempIndex = temp.indexOf(name)
      delete temp[tempIndex]
      this.setState({ selectedformats: temp })
    } else { // otherwise add it
      this.setState({ selectedformats: [...selectedformats, name] })
    }
  }

  getTitle = (e) => {
    this.setState({ setting: e.target.vaule })
  }

  toggle = (name) => {
    this.setState({ toggle: name })
  }

  exportTitle = () => {
    const { setting, selectedformats, checked, filteredData, selectedCurrentCluster, currentClusterKey, specifyNode, selectedCluster, allClusterKey } = this.state
    const request = {}
    request.setting = setting
    request.checked = checked
    request.filetype = selectedformats
    request.data = filteredData
    if (checked === 'current') {
      request.clusterProperty = selectedCurrentCluster
      request.selectedCluster = currentClusterKey
    } else {
      request.specifyNode = specifyNode
      request.clusterProperty = selectedCluster
      request.selectedCluster = allClusterKey
    }

    this.props.exportTopics(request)
    this.setState({ download: 'downloading' })
  }

  setExport = (specifyNode) => {
    this.setState({ specifyNode })
  }
  showbutton = (name) => {
    if (name === 'specify') {
      this.setState({
        show: true,
        checked: name,
      })
    } else {
      this.setState({
        show: false,
        checked: name,
      })
    }
  }
  setContent = (data) => {
    if (this.state.contentSet) {
      if (this.state.checked === 'current') {
        this.setState({
          currentClusterKey: data.allClusterKey,
          selectedCurrentCluster: data.selectedCluster,
          contentSet: true,
        })
      } else {
        this.setState({
          allClusterKey: data.allClusterKey,
          selectedCluster: data.selectedCluster,
          contentSet: true,
        })
      }
    }
  }

  render () {
    const { selectedformats, download } = this.state
    const { filteredData, allCluster, allClusterKey, specifyTopicsNumber, currentNode, specifyNode, selectedCluster, currentCluster, selectedCurrentCluster, currentClusterKey } = this.state
    const { close, history, nodes, progress } = this.props
    let allClusterExport = true
    if (allClusterKey.length !== 0) {
      let specifyAllTopics
      if (specifyNode.length === (history.length - 1)) {
        specifyAllTopics = true
      }

      let cluster = allCluster
      let selected = selectedCluster
      let clusterKey = allClusterKey
      if (this.state.checked === 'current') {
        cluster = currentCluster
        selected = selectedCurrentCluster
        clusterKey = currentClusterKey
      }
      clusterKey.forEach((val) => {
        if (cluster[val].metaData.length !== selected[val].metaData.length) {
          allClusterExport = false
          return
        }
        if (cluster[val].property.length !== selected[val].property.length) {
          allClusterExport = false
        }
      })
      let total = 0
      Object.keys(cluster).forEach((val) => {
        total += cluster[val].number
      })
      return (
        <div>
          {(this.state.toggle === 'main') ? (
            <Container>
              <Wrapper>
                <Window>
                  <Title>Advanced export</Title>
                  <Content>
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                      <SubWrapper>
                        <SubTitle>Settings</SubTitle>
                        <Input
                          onChange={(e) => this.getTitle(e)}
                          placeholder='New export'
                          style={{ marginLeft: '10rem' }}
                        />
                      </SubWrapper>
                      <SubWrapper>
                        <SubTitle>Export from</SubTitle>
                        <SubContent>
                          <CheckBox
                            submit={this.showbutton}
                            checked={this.state.checked}
                            currentClusterNumber={currentNode.clusterNumber}
                            currentTopicsNumber={currentNode.topicsNumber}
                            currentName={currentNode.name}
                            specifyClusterNumber={Object.keys(cluster).length}
                            specifyTopicsNumber={specifyTopicsNumber}
                            specifyNumber={history.length - 1}
                          />
                          <div />
                        </SubContent>
                      </SubWrapper>
                      <div>
                        {
                          (specifyAllTopics) && (<SubExport margin={'0px'}><div>All ({history.length - 1} nodes, {Object.keys(cluster).length} clusters and {specifyTopicsNumber} topics)</div></SubExport>)
                        }
                        {
                          (!specifyAllTopics) && specifyNode.map((val, key) => (<SubExport key={key}>
                            {filteredData[val].name}({filteredData[val].clusterNumber} cluster,{filteredData[val].topicsNumber} topics)
                          </SubExport>))
                        }
                      </div>
                      <div style={{ marginLeft: '30px' }}>
                        {
                          (this.state.checked === 'specify') && (<ManageButton onClick={() => this.toggle('export')}>Manage</ManageButton>)
                        }
                      </div>
                      <SubWrapper>
                        <SubTitle>Content to export</SubTitle>
                        <SubContent>
                          <Element>
                            <ExportContent>
                              {
                                ((clusterKey.length === Object.keys(cluster).length) && allClusterExport) ? (

                                  <div>All ({total}): All</div>
                                ) : (
                                  <div>
                                    {
                                      clusterKey.map((val, key) => (
                                        <div key={key}>
                                          <span>{cluster[val].title} ({cluster[val].number}): </span>
                                          {
                                            (cluster[val].metaData.length === selected[val].metaData.length)
                                              ? (<ExportIcon>All MetaData, </ExportIcon>)
                                              : (<span>
                                                {
                                                  selected[val].metaData.map((value, index) => (
                                                    <ExportIcon key={index}>{value}, </ExportIcon>
                                                  ))
                                                }
                                              </span>)
                                          }
                                          {
                                            (cluster[val].property.length === selected[val].property.length)
                                              ? (<ExportIcon>All Properties</ExportIcon>)
                                              : (<span>
                                                {
                                                  selected[val].property.map((propertyName, keyindex) => (
                                                    <ExportIcon key={keyindex}>{propertyName}, </ExportIcon>
                                                  ))
                                                }
                                              </span>)
                                          }
                                        </div>
                                      ))
                                    }
                                  </div>
                                )
                              }
                            </ExportContent>
                          </Element>
                          <Element>
                            <ManageButton onClick={() => this.toggle('content')}>Manage</ManageButton>
                          </Element>
                        </SubContent>
                      </SubWrapper>
                    </div>
                    <SubWrapper>
                      <SubTitle>Export as</SubTitle>
                      <SubContent>
                        <ButtonWrapper>
                          {
                            SUPPORTED_EXPORTABLE_FORMATS.map(format => {
                              const formatSelected = selectedformats.includes(format)
                              return (formatSelected) ? (
                                <DownFile onClick={() => this.toggleFormat(format)}>
                                  {format}
                                  <DownIcon>{(formatSelected) ? '×' : '+'}</DownIcon>
                                </DownFile>
                              ) : (
                                <DownFileSuccess onClick={() => this.toggleFormat(format)}>
                                  {format}
                                  <DownIconSuccess>{(formatSelected) ? '×' : '+'}</DownIconSuccess>
                                </DownFileSuccess>
                              )
                            })
                          }
                        </ButtonWrapper>
                      </SubContent>
                    </SubWrapper>
                  </Content>
                  <Button className='exportButton' onClick={this.exportTitle}>Export</Button>
                  <Button className='cancelButton' onClick={close}>Cancel</Button>
                  <br />
                  {
                    (!!download && download === 'downloading') && (
                      <div>
                        {
                          (progress === 100) ? (<Download>
                            <DownloadTitle>100%-Download competed !</DownloadTitle>
                            <DownloadContent>Congratulation! Your files are now available on your desktop
                              <DownloadButton onClick={close}>Done</DownloadButton>
                            </DownloadContent>
                          </Download>)
                            : (<Download>
                              <DownloadTitle>Exporting - {progress} %</DownloadTitle>
                              <DownloadContent>Please wait. Files will be downloaded via your browser</DownloadContent>
                            </Download>
                            )
                        }
                      </div>)
                  }
                </Window>
              </Wrapper>
            </Container>
          )
            : (this.state.toggle === 'export') ? (
              <Container>
                <Wrapper>
                  <ExportWindow>
                    <ContentProperty
                      back={() => this.toggle('main')}
                      done={this.setExport}
                      data={filteredData}
                      specifyNode={specifyNode}
                      nodes={nodes}
                      history={history}
                      specifyClusterNumber={Object.keys(cluster).length}
                      specifyTopicsNumber={specifyTopicsNumber}
                    />
                  </ExportWindow>
                </Wrapper>
              </Container>
            )
              : (
                <Container>
                  <Wrapper>
                    <ExportWindow>
                      <ExportProperty
                        back={() => this.toggle('main')}
                        done={this.setContent}
                        data={filteredData}
                        allCluster={cluster}
                        selectedCluster={selected}
                        allClusterKey={clusterKey} />
                    </ExportWindow>
                  </Wrapper>
                </Container>
              )
          }
        </div>
      )
    }
    return (
      <div />
    )
  }
}

export default AdvanceDialog
