import styled from 'styled-components'
import {
  Popup,
} from 'elements/window'

export const VibrantWrapper = styled.div`
  position: relative;
  display: inline-block;
`
export const VibrantToggle = styled.span`
  display: inline-block;
  padding: 0 18px;
  cursor: pointer;
  vertical-align: middle;

  span {
    display: inline-block;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background-color: #54A1D3;
    margin-right: 2px;
  }
`
export const VibrantDrop = styled(Popup)`
  width: 280px;
  position: absolute;
  background: #FFF;
  z-index: 4;
  margin-left: -150px;
  margin-top: -25px;
`

export const VibrantButton = styled.div`
  height: 50px;
  background-color: ${props => props.background};
  color: ${props => props.background ? '#fff' : '#E84F4F'};
  font-size: 13px;
  text-align: center;
  cursor: pointer;
  display: flex;
  align-items: center;

  &:first-child {
    border-radius: 2px 2px 0 0;
  }
 
  &:last-child {
    border-radius: 0 0 2px 2px;
  }

  img {
    display: inline-block;
    width: 17px;
    margin-right: 18px;
    margin-left: 71px;
  }
`
export const BlueText = styled.span`
  color: #54A1D3;
  font-size: inherit;
  font-family: inherit;
  line-height: inherit;
`

export const Link = styled(BlueText)`
  cursor: pointer;
`

export const LinkListHeader = styled.div`
  font-weight: bold;
  margin-bottom: 20px;
`

export const LinkListContent = styled.div`
  color: #000;
`

export const LinkListSeparator = styled.div`
  width: 1px;
  height: 20px;
  background-color: #646464;
  margin-top: -21px;
  margin-left: 8px;
  margin-bottom: -1px;
`

export const LinkListItem = styled.div`
  margin-bottom: 21px;

  img {
    width: 16px;
    margin-right: 13px;
    vertical-align: bottom;
  }
`

export const MergeWrapper = styled.div`
  margin-bottom: 76px;

  .nodes {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
  }

  .node {
    min-width: 200px;
    text-align: center;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 16px;
      margin-left: 3px;
    }
  }

  .merge-tree-container {
    padding: 0 100px;
  }

  .target-node {
    font-weight: bold;
    text-decoration: underline;
    text-align: center;
  }

  .react-autosuggest__container > div:first-child {
    border: none;
    border-bottom: 1px solid #000;
    height: 22px;
    width: 200px;
    padding: 0;
  }

  .react-autosuggest__container .react-autosuggest__suggestions-list {
    border: none;
    background: transparent;
    padding-top: 0;
  }

  .react-autosuggest__suggestions-container--open {
    height: auto;
    border: none;

    .react-autosuggest__suggestions-list {
      width: 200px;
      border: none;
      margin: 0;
      padding: 0;
      overflow-x: hidden;
    }
  }
`

export const MergeTree = styled.svg`
  width: 100%;
  height: 200px;

  line {
    stroke: #979797;
  }
`

export const MergeDescription = styled.div`
  font-size: 14px;
  color: #646464;
  line-height: 18px;
  font-style: italic;
  opacity: 0.55;
  margin-top: 15px;
  margin-bottom: 12px;
`
