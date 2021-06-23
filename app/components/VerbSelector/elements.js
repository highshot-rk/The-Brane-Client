import styled, { css } from 'styled-components'
import {
  Wrapper as DropDownWrapper,
  Label as DropDownLabel,
  Selected as DropDownSelected,
} from '../DropDown/elements'
import {
  Overlay,
} from '../Overlay/elements'

export const VerbSelectorWrapper = styled.div`
  margin: 0 20px;

  ${DropDownWrapper} {
    z-index: 1;
    background-color: white;
    ${props => props.minimal ? '' : css`
    min-width: 200px;
    border: 1px solid rgb(151, 151, 151);
    padding: 15px;
    border-radius: 2px;
    color: #979797;`
}
  }

  ${DropDownLabel} {
    padding: 1px;
  }

  ${DropDownSelected} {
    font-weight: normal;
  }

  ${Overlay} {
    opacity: 0;
  }
`

export const SearchWrapper = styled.div`
  margin-top: 7px;
  margin-left: 15px;
  margin-bottom: 9px;
  position: relative;

  input {
    width: 250px;
    padding-left: 25px;
  }

  img {
    position: absolute;
    top: 5px;
    width: 14px;
  }
`

export const VerbSelectorDrop = styled.div`
  position: absolute;
  width: 280px;
  left: -1px;
  ${props => props.direction === 'up' ? css`bottom: -1px;` : css`top: -1px;`}
  background: white;
  box-shadow: 0 2px 15px 0 rgba(0, 0, 0, 0.15);
  max-height: 440px;
  min-height: 300px;
  overflow-y: auto;
  z-index: 2;

  ul {
    list-style: none;
    padding-left: 0;
  }

  ul li {
    font-weight: normal;
    color: #29303F;
    padding: 6px 30px;
    border-bottom: 1px solid rgba(151, 151, 151, 0.17);

    &:last-child {
      border-bottom: none;
    }

    .icon,
    svg {
      margin-right: 12px;
    }

    .icon {
      border-radius: 50%;
      border: 1px solid black;
      width: 17px;
      height: 17px;
      display: inline-block;
      text-align: center;
      line-height: 16px;
    }

    &.reverse-icon svg {
      transform: rotate(90deg) !important;
    }
  }
`
