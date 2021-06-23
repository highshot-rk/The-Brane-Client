import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Window, WindowHeader } from 'elements/window'
import Overlay from '../Overlay'
import publicationTypes from './publicationTypes'
import Select from 'react-select'
import { SelectType, FormContainer, PublicationWrapper } from './elements'
import Dropzone from 'react-dropzone'
import { uniqueId, cloneDeep } from 'lodash-es'
import {
  InputRow,
  InputWrapper,
  Submit,
  AddRowButton,
} from 'elements/form'
import { connect } from 'react-redux'
import { addPublication } from 'api/publication'

class NewPublication extends Component {
  static propTypes = {
    user: PropTypes.object,
    nodes: PropTypes.array,
    toggleNewPublication: PropTypes.func,
  }

  state = {
    selectedType: null,
    missingFields: [],
    typesOptions: cloneDeep(publicationTypes),
    authors: [],
  }

  handleTypeChange = type => {
    this.setState({
      selectedType: type,
    })
  }

  componentWillMount () {
    this.setState({
      authors: [
        { name: this.props.user.fn, id: uniqueId('author-') },
      ],
    })
  }

  getField = (selectedType, toGet) => {
    let field = selectedType.fields.filter(item => item.name === toGet)[0]
    if (field) {
      return field
    } else {
      return { value: '' }
    }
  }

  onFieldChange = ({ target: { value } }, field) => {
    let newValues = [...this.state.selectedType.fields]
    let currentFieldIndex = newValues.findIndex(f => f.id === field.id)
    if (currentFieldIndex !== -1) {
      newValues[currentFieldIndex].value = value
      this.setState({
        selectedType: {
          ...this.state.selectedType,
          fields: newValues,
        },
      })
    }
  }

  onAuthorFieldChange = ({ target: { value } }, { index }) => {
    let newValues = [...this.state.authors]
    newValues[index].name = value
    this.setState({
      authors: newValues,
    })
  }

  onSubmitPublication = () => {
    const { selectedType, authors } = this.state
    const { nodes } = this.props
    let payload = {
      type: selectedType.label,
      title: this.getField(selectedType, 'Title').value,
      date: this.getField(selectedType, 'Date').value,
      DOI: this.getField(selectedType, 'DOI').value,
      files: [this.getField(selectedType, 'Upload File').value],
      authors: authors.map(author => ({ name: author.name })),
    }
    if (nodes) {
      payload = { ...payload, nodes }
    }
    addPublication(payload).then(response => {
      this.props.toggleNewPublication()
    })
  }
  get completed () {
    const { selectedType, authors } = this.state
    let missing = []
    if (selectedType && selectedType.fields) {
      selectedType.fields.map(field => {
        if (!field.value || !field.value.length > 0) {
          missing.push(field.name)
        }
      })
      authors.map(field => {
        if (!field.name.length > 0) {
          missing.push(field.name)
        }
      })
    }
    return missing.length === 0
  }

  addAuthor = () => {
    this.setState({
      authors: [...this.state.authors, { name: '', id: uniqueId('author-') }],
    })
  }

  removeAuthor = index => {
    this.setState({
      authors: [
        ...this.state.authors.filter((n, _index) => _index !== index),
      ],
    })
  }

  renderAuthors () {
    return (
      <>
        {this.state.authors.map((author, index) => (
          <InputRow key={author.id} style={{ marginBottom: 0 }} direction='horizontal'>
            <InputWrapper
              transparentIcon
              error={this.state.missingFields.includes(author.name)}
              height='auto'
              style={{ marginRight: '5px' }}
              className='inputWrapper'>
              <input
                value={author.name}
                onChange={e => this.onAuthorFieldChange(e, { author, index })}
                placeholder='Author Name' />
              {index !== 0 && <button style={{ height: 'auto' }} onClick={() => this.removeAuthor(index)}>x</button>}
            </InputWrapper>
          </InputRow>
        ))}
        <AddRowButton condensed onClick={this.addAuthor}>
          <button>+</button>
          <span>Add author</span>
        </AddRowButton>
      </>
    )
  }

  render () {
    const { toggleNewPublication } = this.props
    const { selectedType, missingFields, typesOptions } = this.state
    return (
      <PublicationWrapper>
        <Overlay onClose={toggleNewPublication} />
        <Window>
          <WindowHeader>Add Publication</WindowHeader>
          <FormContainer>
            <SelectType>
              <Select
                placeholder='Type of Publication'
                searchable={false}
                value={selectedType}
                onChange={this.handleTypeChange}
                options={typesOptions}
              />
            </SelectType>
            <InputRow direction='vertical'>
              {selectedType && selectedType.fields.map(field =>
                <div key={field.id}>
                  {(field.type === 'file' && selectedType.id !== 'ty09') &&
                    <InputRow style={{ marginBottom: 0 }} direction='horizontal'>
                      <InputWrapper
                        error={missingFields.includes(field.name)}
                        height='auto'
                        className='inputWrapper'>
                        <input
                          value={field.value || ''}
                          onChange={e => this.onFieldChange(e, field)}
                          placeholder='URL' />
                      </InputWrapper>
                      <Dropzone className='uploadFile' onDrop={this.onDrop}>
                        <p>or Upload file</p>
                      </Dropzone>
                    </InputRow>
                  }
                  {field.type === 'string' &&
                    <InputWrapper
                      error={missingFields.includes(field.name)}
                      height='auto'
                      className='inputWrapper'>
                      <input
                        value={field.value}
                        onChange={e => this.onFieldChange(e, field)}
                        placeholder={field.name} />
                    </InputWrapper>
                  }
                  {field.type === 'date' &&
                    <InputWrapper
                      error={missingFields.includes(field.name)}
                      height='auto'
                      className='inputWrapper'>
                      <input
                        type='date'
                        className={field.value && 'has-value'}
                        value={field.value}
                        onChange={e => this.onFieldChange(e, field)}
                        placeholder={field.name} />
                    </InputWrapper>
                  }
                </div>
              )
              }
              {selectedType && this.renderAuthors()}
            </InputRow>
            <Submit
              disabled={!selectedType}
              showAsDisabled={!this.completed}
              onClick={this.onSubmitPublication}>
              Submit
            </Submit>
          </FormContainer>
        </Window>
      </PublicationWrapper>

    )
  }
}

function mapStateToProps (state) {
  return state.auth
}

const NewPublicationPage = connect(mapStateToProps)(
  NewPublication
)

export default NewPublicationPage
