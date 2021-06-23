import styled from 'styled-components'

const LEFT_MARGIN = 24

export const Wrapper = styled.div`
  background-color: white;
  z-index: 2;
  position: absolute;
  left: 50%;
  width: 300px;
  top: 50%;
  height: 400px;
  margin-top: -200px;
  border-radius: 4px;
  font-size: 14px;
  overflow-y: auto;
`

export const RestoreAll = styled.div`
  background-color: #19B7D8;
  border-radius: 4px 4px 0 0;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
`

export const Separator = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 36px;
`

export const RestoreLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  &::before,
  &::after {
    width: 75px;
    height: 1px;
    background-color: #E0E0E0;
    content: '';
    display: inline-block;
  }
`

export const Search = styled.div`
  display: flex;
  align-items: center;
  height: 50px;

  input {
    border: none;
    height: 18px;
    width: 217px;
    padding-bottom: 4px;
    padding-left: 0;
    outline: none;
    border-bottom: 1px solid #E7E7E7;
    font-size: 14px;
    font-family: 'HK Grotesk', sans-serif;
    margin-left: ${LEFT_MARGIN}px;
  }
`
export const Body = styled.div`
  padding: 0;
`

export const Node = styled.div`
  display: flex;
  align-items: center;
  padding-left: ${props => props.level * LEFT_MARGIN + LEFT_MARGIN}px;
  height: ${props => props.condensed ? '30px' : '44px'};
  cursor: pointer;
  background-color: ${props => props.selected ? '#F8F8F8' : '#FFF'};

  & .circle {
    width: 14px;
    height: 14px;
    border: 1px solid #2D2D2D;
    border-radius: 50%;
    display: inline-block;
    margin-right: 12px;
  }

  & .title {
    width: ${props => 300 - (props.hasBranchOffs > 0 ? 125 : 70) - (props.level * LEFT_MARGIN + LEFT_MARGIN)}px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-weight: ${props => props.bold ? 'bold' : 'normal'};
  }

  .read {
    display: none;
    position: absolute;
    right: ${props => props.hasBranchOffs ? '106px' : '10px'};
    height: 14px;
    cursor: pointer;
  }

  &:hover {
    background-color: #F8F8F8;
  }

  &:hover .read {
    display: block;
  }

  .offBranches {
    position: absolute;
    right: 22px;
    color: #868F96;
    height: 40px;
    display: flex;
    align-items: center;

    /* Prevents selecting while clicking */
    user-select: none;

    .offBranchesCircle {
      background-color: ${props => props.offBranchesVisible ? '#A1ABB4' : '#19B7D8'};
      color: white;
      border-radius: 50%;
      width: 16px;
      height: 16px;
      display: inline-block;
      text-align: center;
      font-size: 10px;
      padding-top: 2px;
      margin-right: 4px;
    }
  }
`

export const OffBranch = styled.div`
  padding-left: 60px;
  margin-top: -5px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 12px;

  .circle {
    background-color: #19B7D8;
    border-radius: 50%;
    display: block;
    height: 14px;
    width: 14px;
    margin-right: 12px;
  }

  &:hover {
    background-color: #F8F8F8;
  }
`

export const NodeSeparator = styled.div`
  display: block;
  height: 10px;
  width: 1px;
  margin: -6px 0 -6px ${props => LEFT_MARGIN * props.level + 30}px;
  background-color: #2D2D2D;
  z-index: 51;
  position: relative;
  transform: ${props => props.angled ? 'rotate(-28deg) translate(12px, 6px)' : ''};
`

export const Back = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 7px 0 7px 22px;

  &:hover {
    background-color: #F8F8F8;
  }

  svg {
    width: 15px;
    height: 15px;
  }

  span {
    display: inline-block;
    margin-left: 12px;
    padding-top: 1px;
    color: #676767;
  }
`
