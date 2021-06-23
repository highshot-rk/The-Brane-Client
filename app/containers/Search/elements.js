import styled, { css } from 'styled-components'

export const SearchTitle = styled.div`
  display: flex;
  justify-content: space-around;
  border: none;
  min-height: 45px;
  width: 100%;
  outline: none;
  font-size: 14px;
  font-family: HKGrotesk, sans-serif;
  background-color: #F2F2F2;
  align-items: center;
  padding: 0 15px;
  flex-flow: row nowrap;

  span {
    float: left;
    line-height: 18px;
    font-size: 10px;
    padding-right: 8px;
  }

  .advanced-slider {
    display: flex;
    align-items: center;
    margin-top: 2px;
  }
`

export const SearchContainer = styled.div`
  font-weight: bold;
  align-items: center;
  max-width: ${props => props.width};
  ${props => props.width === '100%' && !props.locked && css`flex-grow: 1;`}
  margin-right: 9px;

  input {
    outline: none;
    background-color: transparent;
    display: ${props => props.locked ? 'none' : 'block'};
    min-width: 100%;
    height: 30px;
    padding-left: 0;
    color: #757575;
    margin-top: ${props => props.vennDiagram ? 2 : 0}px;

    /* Changes to the font need to be updated in the searchInput component */
    font-size: 12px;
    font-weight: 500;
    font-family: HKGrotesk, sans-serif;

    &:placeholder {
      opacity: ${props => props.vennDiagram ? 0 : 1};
    }
  }

  .locked {
    font-family: HKGrotesk, sans-serif;
    color: #515151;
    padding: 2px 8px;
    border-radius: 10px;
    border: 1px solid #515151;
    display: ${props => props.locked ? 'block' : 'none'};
    cursor: pointer;
    margin: 0;
    margin-right: 13px;
    white-space: nowrap;
    font-size: 12px;
    line-height: 15px;
    font-weight: normal;
    width: 100%;
    overflow-x: hidden;
    text-align: center;

    &:hover {
      opacity: 0.75;
    }
  }
`

export const Queries = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  padding-right: 10px;
  overflow-x: auto;
`

export const VennDiagramToggle = styled.div`
  padding: 7px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  display: block;

  svg {
    margin-top: -5px;
    width: 24px;
    height: 24px;
  }
`

export const AddQuery = styled.div`
  position: relative;

  .toggle {
    cursor: pointer;
  }

  .toggle-ui {
    display: flex;
    justify-content: center;
    align-items: center;
    color: black;

    &.selected {
      padding: 2px 8px;
      background: #515151;
      border-radius: 2px;
      color: white;
      margin-right: 9px;
    }

    .icon-venn {
      width: 26px;
      height: 26px;
      margin-left: 2px;
    }

    .icon-arrow {
      width: 17px;
      height: 15px;
      transform: scale(0.7, 0.7) translate(-15px, -4px);
    }
  }

  .suggestions {
    display: none;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.5);
    position: fixed;
    margin-left: -11px;
    margin-top: 3px;
    width: 140px;
    background-color: #FFF;
    z-index: 10;

    &.expanded {
      display: block;
    }
  }

  .suggestion {
    padding: 6px 13px 5px 13px;
    background-color: #FFF;
    font-size: 14px;

    span {
      font-size: 14px;
      display: inline-block;
      width: 20px;
      padding-top: 2px;
    }

    img {
      float: right;
      margin-top: 4px;
    }

    &:last-of-type {
      padding-bottom: 9px;
    }

    &:hover {
      background-color: #F8F8F8;
    }
  }

  .separator {
    border-top: 1px solid #C4C4C4;
    width: 97px;
    margin-left: auto;
    margin-right: auto;
  }

  .clear {
    text-align: center;
    padding: 5px 0;

    &:hover {
      background-color: #F8F8F8;
    }

    strong {
      font-size: 10px;
    }
  }
`

export const FilterList = styled.div`
  background-color: #F8F8F8;
  min-width: 280px;
  float: left;
  align-self: stretch;
  overflow-y: auto;
`

export const Flex = styled.div`
  display: flex;
  align-self: stretch;
  flex-grow: 1;
  overflow: hidden;
`

export const SearchActions = styled.div`
  padding: ${props => `${props.hasResults ? 9 : 19}px 16px 0 19px`};

  p {
    margin: 0;
    padding: 10px 20px;
    cursor: pointer;
  }
`

export const LoadingWrapper = styled.div`
  padding: 9px 16px;
  background: white;
  width: 100%;

  p {
    font-size: 12px;
  }
`

export const Separator = styled.div`
  width: 100%;
  border-top: 1px solid rgba(196, 196, 196, 0.5);
`

export const CreationSuggestions = styled.div`
  padding: ${props => props.someResults ? '25px' : '6px'} 30px 25px 30px;

  p {
    text-align: center;
    font-size: 10px;
    padding: 5px;
  }
`

export const Create = styled.p`
  &&& {
    text-align: center;
    padding: 12px 0;
  }

  img {
    margin-right: 10px;
  }
`

export const Clear = styled.div`
  cursor: pointer;
  padding-right: 18px;

  img {
    width: 8px;
    height: 8px;
  }
`
