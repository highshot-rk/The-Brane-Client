import { Body, Head, SmallTitle, Title, Toggle } from './elements'
import Icon from 'components/Icon'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import Checkbox from '../IndeterminateCheckbox'

export default class Accordion extends Component {
  static propTypes = {
    title: PropTypes.string,
    smallTitle: PropTypes.oneOfType([
      PropTypes.number,
      PropTypes.string,
    ]),
    open: PropTypes.bool,
    toggleOpen: PropTypes.func,
    disabled: PropTypes.bool,
    showCheckbox: PropTypes.bool,
    checked: PropTypes.bool,
    onChecked: PropTypes.func,
    subAccordion: PropTypes.bool,
    condensed: PropTypes.bool,
    name: PropTypes.string,
    highlight: PropTypes.bool,
    indeterminate: PropTypes.bool,
    children: PropTypes.node,
    noOffset: PropTypes.bool,
  }
  toggleVisible = (e) => {
    if (e.target.type === 'checkbox') {
      return
    }

    this.props.toggleOpen(this.props.name)
  }
  onChecked = (e) => {
    const {
      indeterminate,
      name,
      onChecked,
    } = this.props

    let checked = e.target.checked

    e.stopPropagation()

    if (indeterminate) {
      checked = true
    }

    onChecked(name, checked)
  }
  render () {
    const {
      children = [],
      condensed,
      disabled,
      showCheckbox,
      subAccordion,
      highlight,
      checked,
      indeterminate,
      smallTitle,
      open,
      title,
      noOffset,
      icon,
    } = this.props

    return (
      <div>
        <Head
          condensed={condensed}
          onClick={this.toggleVisible}
          disabled={disabled}
          checkboxShown={showCheckbox}
          subAccordion={subAccordion}
          highlight={highlight}
        >
          {icon ? <img src={icon} alt='icon' /> : null}
          <Title condensed={condensed} subAccordion={subAccordion}>
            {showCheckbox
              ? <Checkbox
                type='checkbox'
                checked={checked || false}
                onChange={this.onChecked}
                indeterminate={indeterminate}
              /> : null}
            {`${title}`}
          </Title>
          <SmallTitle subAccordion={subAccordion} disabled={disabled}>
            {smallTitle}
          </SmallTitle>
          <Toggle
            contentVisible={open && !disabled}
            visible={children.length > 0 && !condensed}><Icon name='arrow' width={20} height={20} />
          </Toggle>
        </Head>
        <Body visible={open} condensed={condensed} noOffset={noOffset}>
          {open && children}
        </Body>
      </div>
    )
  }
}
