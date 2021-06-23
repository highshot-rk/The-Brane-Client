import styled from 'styled-components'
import { AddRowButton } from 'elements/form'

export const Toolbar = styled.div`
  min-height: 40px;
  display: flex;
  align-items: center;
  padding: 0 18px;
  justify-content: left;
  border-bottom: 1px solid #E7E7E7;
  position: relative;
`

export const SearchIcon = styled.img`
  width: 12px;
`

export const DismissButton = styled.p`
  text-align: center;
  cursor: pointer;
  color: #646464;
  display: inline-block;
  margin-bottom: 5px;
`

export const PreviousButton = styled.p`
  display: inline-block;
  cursor: pointer;
  color: #646464;
  margin-right: 40px;
  margin-bottom: 5px;

  svg {
    width: 5px;
    max-height: 8px;
    margin-right: 7px;
    margin-top: -2px;
    stroke-width: 1px;
    stroke: black;
  }
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
  padding: 10px;
  overflow-y: auto;
  max-height: 330px;
  min-height: 330px;
`

export const SelectedGroup = styled.div`
  h6 {
    margin-bottom: 6px;
  }

  div {
    padding-left: 6px;

    button {
      width: 13px;
      height: 13px;
    }
  }

  margin-bottom: 24px;
`

export const Container = styled.div`
  border: 1px solid #E7E7E7;
  display: flex;
  flex-direction: row;
  max-height: 664px;
  overflow: hidden;

  section {
    flex: 1;

    h2 {
      color: #2E2E2E;
      font-size: 16px;
      text-align: center;
      font-weight: normal;
      border-bottom: 1px solid #E7E7E7;
      padding: 8px;
    }

    &:first-of-type {
      border-right: 1px solid #E7E7E7;
    }
  }
`
export const ListOption = styled(AddRowButton)`
  margin-top: 11px;

  span {
    flex-grow: 1;
  }

  svg {
    fill: #646464;
    max-height: 17px;
    width: 6px;
    transform: rotate(180deg);
  }
`

export const DeleteButton = styled.button`
  && {
    width: 13px;
    height: 13px;
    font-size: 30px;
    padding-left: 0;
    line-height: 16px;
    background: #E84F4F;
  }
`

export const SearchFilter = styled.div`
  position: absolute;
  right: 10px;
  color: #B3B3B3;
  font-size: 10px;
  white-space: nowrap;
  margin-top: 2px;
  cursor: pointer;
`
