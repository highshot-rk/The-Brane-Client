import styled from 'styled-components'

export const Header = styled.div`
  background-color: ${props => props.fade ? '#434343' : '#F8F8F8'};
  height: 60px;
  padding: 20px;
  display: flex;
  align-items: center;
`
export const HistoryWrapper = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  font-size: 0.75rem;
  font-weight: 500;
  max-height: 200px;
  overflow-y: auto;
  transition: all ease-in-out 0.3s;
`

export const HistoryItemWrapper = styled.li`
  position: relative;
  display: flex;
  align-items: center;
`

export const HistoryNode = styled.div`
  padding: ${props => props.root ? '1rem 1rem 1rem .5rem' : '.75rem'};
  margin-left: ${props => props.root ? '0' : '.5rem'};
  position: relative;
  font-weight: ${props => props.active ? 'bold' : '500'};

  &::before {
    display: ${props => props.root ? 'none' : 'auto'};
    content: '';
    border-radius: 50%;
    width: 1rem;
    height: 1rem;
    border: 1px solid #2D2D2D;
    position: absolute;
    left: -1rem;
    background-color: ${props => props.active ? '#2D2D2D' : 'none'};
  }

  &:hover {
    cursor: pointer;

    &::before {
      background-color: #2D2D2D;
    }
  }

  &::after {
    content: '';
    position: absolute;
    display: ${props => props.linked ? 'none' : 'auto'};
    width: 1px;
    height: 10px;
    left: ${props => props.root ? '-12.5px' : '-8.5px'};
    top: -7.5px;
    background-color: #2D2D2D;
  }

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    white-space: nowrap;
    max-width: 145px;
  }
`

export const MenuIcon = styled.img`
  width: 2rem;
  height: 2rem;
  cursor: pointer;
`

export const ExpandContractIcon = styled.img`
  width: auto;
  height: 13px;
  cursor: pointer;
`

export const MinimizeButton = styled.div`
  background-color: #202020;
  width: 19px;
  padding: 8px;
  height: 100%;
  display: flex;
  cursor: pointer;
  min-height: 212px;

  svg {
    margin: auto;
  }

  &:hover {
    background-color: #2D2C2C;
  }
`

export const RootIcon = styled.div`
  margin-left: 1.5rem;
  margin-top: -9px;
  cursor: pointer;
`

export const Title = styled.span`
  font-size: 13px;
  font-weight: bold;
  cursor: #646464;
  letter-spacing: 1px;
  flex-grow: 1;
`
export const Body = styled.div`
  padding: 20px;
  transition: padding ease-in-out 0.3s;
`
export const FlexRow = styled.div`
  display: flex;

  section {
    flex: 1;

    &:last-child {
      flex-grow: 0;
    }
  }
`

export const Window = styled.div`
  position: absolute;
  top: 20px;
  right: 0;
  background-color: ${props => props.fade ? '#434343' : '#FFF'};
  width: 280px;
  border-radius: 2px;
  z-index: 0;
  box-shadow: -4px 3px 16px 2px rgba(0, 0, 0, 0.4);
  transition: height ease-in-out 0.3s;
  ${({ isPathWindowMinimized }) => isPathWindowMinimized && `
    width: auto;
  `}

  ${FlexRow} {
    ${({ isPathWindowMinimized }) => isPathWindowMinimized && `
      section {
        &:first-child {
          display: none;
      }
      }
  `}
  }

  ${Body} {
    ${HistoryWrapper} {
      ${({ isPathWindowExpanded }) => isPathWindowExpanded && `
      max-height: calc(100vh - 250px);
      height: auto;
    `}
    }
  }
`

export const IconWrapper = styled.svg`
  width: 2rem;
  height: 2rem;
  margin-right: 0.25rem;
  visibility: ${props => props.visible ? 'visible' : 'hidden'};
`

export const Separator = styled.div`
  height: 1px;
  background: #2D2D2D;
`
