import PropTypes from 'prop-types'
import React from 'react'
import Dialog from 'components/Dialog'
import {
  cloneDeep,
} from 'lodash-es'
import { ENTER } from 'utils/key-codes'

export default function withFormWindowLogic (Component, {
  onSave,
  successMessage,
  errorMessage,
  defaultData,
  isClean,
  afterSave,
  readyForSubmit,
}) {
  class Form extends React.Component {
    constructor (props) {
      super(props)

      this.state = {
        data: cloneDeep(props.data || defaultData || {}),
        dirty: false,
        progress: 0,
        saving: false,
        showConfirmation: false,
        canSubmit: null,
        childrenForms: 0,
      }
    }

    // Context is used to let FormWindowLogic components know if they are the top form
    // for keyboard shortcuts
    // TODO: make this into a HOC and re-use in the Overlay component for it's keyboard shortcuts
    static childContextTypes = {
      onOpen: PropTypes.func,
      onClose: PropTypes.func,
    }
    static contextTypes = {
      onOpen: PropTypes.func,
      onClose: PropTypes.func,
    }
    getChildContext () {
      return {
        onOpen: () => {
          this.setState({
            childrenForms: this.state.childrenForms + 1,
          })
        },
        onClose: () => {
          this.setState({
            childrenForms: this.state.childrenForms - 1,
          })
        },
      }
    }

    // If the component calls saveData twice very quickly, the second
    // time overwrites any changes to the first time
    // This stores the last change until the next render
    // TODO: remove the need for this
    _lastData = null

    getMessage = (messageHandler, ...props) => {
      if (typeof messageHandler === 'string') {
        return messageHandler
      } else {
        return messageHandler(this.state.data, this.props, ...props)
      }
    }
    showMessage = (handler, ...props) => {
      if (handler) {
        this.props.setPopupMessage({
          message: this.getMessage(handler, ...props),
        })
      }
    }
    onSave = async () => {
      if (this.state.saving) {
        return
      }

      try {
        this.setState({
          progress: 0,
          saving: true,
        })
        let done = 0
        const potentialPromises = await onSave(this.state.data, this.props)

        // Check if array of promises
        if (
          potentialPromises instanceof Array &&
          potentialPromises[0] &&
          typeof potentialPromises[0].then === 'function'
        ) {
          const promises = potentialPromises.map(promise =>
            promise && promise.then(() => {
              done += 1
              this.setState({
                progress: Math.floor(done / promises.length * 100),
              })
            })
          )

          await Promise.all(promises)
        }

        if (typeof afterSave === 'function') {
          afterSave(this.state.data, this.props, potentialPromises)
        }

        this.props.onClose()
        this.showMessage(successMessage)
      } catch (e) {
        this.setState({
          saving: false,
        })

        this.showMessage(errorMessage, e)

        throw e
      }
    }
    setData = (data, dirty = true) => {
      const newData = {
        ...(this._lastData || this.state.data),
        ...data,
      }
      dirty = this.state.dirty || dirty
      this.setState({
        data: newData,
        dirty: dirty === false ? false : this.checkDirty(newData),
        canSubmit: this.checkReadyForSubmit(newData, dirty),
      })

      this._lastData = newData
    }
    setDirty = (dirty) => {
      this.setState({
        dirty,
        canSubmit: this.checkReadyForSubmit(this.state.data, dirty),
      })
    }
    checkDirty = (data) => {
      if (isClean) {
        return !isClean(data)
      }

      return true
    }
    checkReadyForSubmit (data, dirty) {
      dirty = typeof dirty === 'undefined' ? this.state.dirty : dirty

      if (typeof readyForSubmit === 'function') {
        return dirty && readyForSubmit(data || this.state.data)
      }

      return dirty
    }
    onClose = () => {
      if (this.state.dirty) {
        this.setState({
          showConfirmation: true,
        })
      } else {
        this.props.onClose(true)
      }
    }
    handleConfirmation = (button) => {
      this.setState({
        showConfirmation: false,
      })

      switch (button) {
        case 'NO':
          return this.state.canSubmit && this.props.onClose()
        case 'YES':
          if (!this.state.canSubmit) {
            return this.props.onClose()
          }

          return this.onSave()

        // no default
      }
    }
    documentKeyHandler = (event) => {
      const canSubmit = this.state.canSubmit

      if (
        // Do not submit when pressing enter in a text area or tag selector
        document.activeElement === document.body &&
        event.keyCode === ENTER &&
        // Only handle event if top form
        this.state.childrenForms === 0 &&
        canSubmit) {
        this.onSave()
      }
    }
    componentWillMount () {
      document.addEventListener('keydown', this.documentKeyHandler)
      if (this.context.onOpen) {
        this.context.onOpen()
      }
    }
    componentWillUnmount () {
      document.removeEventListener('keydown', this.documentKeyHandler)
      if (this.context.onClose) {
        this.context.onClose()
      }
    }
    componentDidUpdate = () => {
      this.lastData = null
    }
    render () {
      return (
        <span>
          <Component
            {...this.props}
            data={this.state.data}
            setData={this.setData}
            saving={this.state.saving}
            progress={this.state.progress}
            onSave={this.onSave}
            onClose={this.onClose}
            onCancel={() => this.props.onClose()}
            setDirty={this.setDirty}
            dirty={this.state.dirty}
            readyToSubmit={this.state.canSubmit}
          />
          {this.state.showConfirmation &&
          <Dialog
            onClick={this.handleConfirmation}
            text={
              this.state.canSubmit
                ? 'Save your latest modifications?'
                : 'Are you sure you want to exit? All changes will be lost.'
            }
            buttons={
              this.state.canSubmit ? [{
                style: 'cta',
                text: 'YES',
              }, {
                style: 'normal',
                text: 'NO',
                negative: true,
              }, {
                style: 'transparent',
                text: 'CANCEL',
              }]
                : [
                  {
                    style: 'cta',
                    text: 'NO',
                  },
                  {
                    style: 'transparent',
                    text: 'YES',
                    negative: true,
                  },
                ]}
          />
          }
        </span>
      )
    }
  }

  Form.propTypes = {
    onClose: PropTypes.func,
    setPopupMessage: PropTypes.func,
  }

  return Form
}
