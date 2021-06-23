import styled, { css } from 'styled-components'

export const Head = styled.div`
  display: flex;
  ${({ subAccordion, condensed, checkboxShown }) => {
    if (condensed && checkboxShown) {
      return `padding: 9px 0 9px 0;`
    } else if (condensed) {
      return `padding: 9px 10px 9px 15px;`
    } else if (subAccordion) {
      return `padding: 10px 10px 10px 15px;`
    } else {
      return `padding: 10px`
    }
  }}
  cursor: ${props => props.disabled ? 'default' : 'pointer'};
  width: 100%;
  ${({ disabled }) => disabled && `
    opacity: 0.3;
    background-color: 'rgb(233, 233, 0.5)';
  `}
  background-color:
    ${props => props.highlight
    ? 'rgb(240, 240, 240)'
    : 'unset'};

  &:hover {
    ${props => props.subAccordion ? '' : 'background-color: rgb(233,233,233)'};
  }
`

export const Title = styled.span`
  font-weight: ${({ subAccordion, condensed }) => subAccordion || condensed ? 'normal' : 'bold'};
  ${props => props.subAccordion ? `text-overflow: ellipsis;
  // min-width required for text-overflow to work in flexbox
  min-width: 1px;
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;` : ''}

  input {
    margin-right: 10px;
    vertical-align: text-bottom;
  }

  input[type='checkbox'] {
    background: transparent;
    ${(props) =>
    props.condensed &&
    css`
      border: none;
      margin-right: 5px;
  `/* sc-block */}
  }
`

export const SmallTitle = styled.span`
  visibility: ${props => props.disabled ? 'hidden' : 'visible'};
  display: inline-block;
  padding-left: 6px;
  flex-grow: 1;
`

export const Toggle = styled.span`
  svg {
    width: 14px;
    height: 14px;
    transform: rotate(${(props) => props.contentVisible ? '90' : '-90'}deg);
    float: right;
    margin-top: 2px;
    visibility: ${({ visible }) => visible ? 'visible' : 'hidden'};
  }
`

export const Body = styled.div`
  display: ${(props) => props.visible ? 'block' : 'none'};
  padding: ${(props) => props.condensed ? '0 20px' : props.noOffset ? '5px 0' : '5px 0 5px 20px'};
`
