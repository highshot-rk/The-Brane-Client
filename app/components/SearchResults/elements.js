import styled, { css } from 'styled-components'

export const SearchResults = styled.div`
  width: 300px;
  float: left;
  align-self: stretch;
  display: flex;
  flex-flow: column;
  overflow-y: auto;
  overflow-x: hidden;
  flex-grow: 1;
  background-color: #FFF;
  max-height: fit-content;

  p,
  span {
    font-size: 12px;

    &.centered {
      text-align: center;
    }
  }
`

export const ResultList = styled.div`
  padding-top: 15px;
  flex-grow: 1;
  overflow-y: auto;
`

export const Result = styled.div`
  padding: ${props => props.condensed ? '11px 8px 0 30px' : '5px 20px 8px 39px'};
  font-size: 12px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  background-color: ${props => props.selected ? '#F8F8F8' : '#FFF'};

  .count {
    display: inline-block;
    min-width: 30px;
    text-align: center;
  }

  ${props => props.condensed && css`
    &:first-child {
      padding-top: 0;
      margin-top: -4px;
    }
  `}

  &:hover {
    background-color: #F8F8F8;
  }
`
