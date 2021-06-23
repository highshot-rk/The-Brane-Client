import styled from 'styled-components'
import { VerbSelectorDrop } from '../VerbSelector/elements'
import { Wrapper as DropDownWrapper, Arrow as DropDownArrow, Selected as DropDownSelected } from '../DropDown/elements'

export const Container = styled.div`
  border: 1px solid #E7E7E7;
  border-radius: 2px 0 0 2px;
  height: 400px;
  display: flex;
  flex-direction: column;
`

export const Toolbar = styled.div`
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  justify-content: ${props => props.justify || 'left'};
`

export const SearchIcon = styled.img`
  width: 12px;
`

export const Search = styled.input`
  height: 40px;
  outline: none;
  width: 200px;
  font-size: 13px;
  padding-left: 10px !important;
`

export const Content = styled.div`
  flex-grow: 1;
  border: 1px solid #E7E7E7;
  border-width: 1px 0 1px 0;
  padding: 10px 25px;
  overflow-y: auto;

  table {
    width: 100%;
  }
`

export const LinkRow = styled.tr`
  align-items: center;
  color: #646464;
  margin-bottom: 10px;
  font-size: 14px;

  .targetTitle {
    white-space: nowrap;
  }

  .nodeTitle {
    text-align: left;
    font-weight: bold;
    white-space: nowrap;
    padding-left: 20px;
  }

  .views {
    width: 100%;
    text-align: center;
  }

  input[type='checkbox'] {
    margin-right: 7px;
    width: 17px;
    vertical-align: middle;
  }

  /* This and the next block are needed
    so the drop doesn't get cut off by the overflow
    of the Content block
  */
  ${DropDownWrapper} {
    position: static;
    padding: 0;
    white-space: nowrap;
  }

  ${VerbSelectorDrop} {
    position: fixed;
    left: 50%;
    bottom: 50%;
    margin-left: -240px;
    transform: translateY(50%);

    /* Since it can't overflow the window, this limits it to the size of the window */
    max-height: 80vh;
  }

  ${DropDownArrow} {
    float: none;

    svg {
      /* Prevents it from making the row taller when expanded */
      margin-top: -10px !important;
    }
  }

  ${DropDownSelected} {
    /* Fixes arrow wrapping beneath selected text */
    white-space: nowrap;
    width: 100%;
  }
`

export const Expand = styled.img`
  cursor: pointer;
  width: 12px;
  margin-left: 20px;
  transform: rotate(${(props) => props.expanded ? '90' : '-90'}deg);
`

export const DefinitionContainer = styled.tr`
  td {
    padding-left: 22px;
  }

  p {
    font-size: 10px;
    line-height: 12px;
  }
`
export const DefinitionHeading = styled.p`
  font-weight: bold;
  font-size: 12px;
`

export const PreviewIcon = styled.img`
  height: 30px;
  float: right;
  padding-right: 25%;
`

export const Button = styled.button`
  height: 27px;
  min-width: 40px;
  color: #FFF;
  font-size: 14px;
  border-radius: 2px;
  line-height: 18px;
  text-align: center;
  background-color:
    ${props => props.disabled
    ? '#9B9B9B'
    : props.negative
      ? '#E84F4F'
      : '#83c686'};
  margin-right: 15px;
  display: flex;
  align-items: center;
  padding: 0 14px 0 10px;

  img,
  span {
    width: 12px;
    margin-right: 14px;
  }
`

export const SelectedCount = styled.div`
  color: #54A1D3;
  text-align: center;
  margin-top: 14px;
`
