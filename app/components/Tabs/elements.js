import styled from 'styled-components'

export const TabWrapper = styled.div`
  display: flex;
  margin: 0 18px 0 270px;
`

export const Tab = styled.div`
  margin-left: 35px;
  height: 43px;
  line-height: 44px;
  color: #444;
  opacity: ${props => props.selected ? '1' : '0.4'};
  padding: 0 2px;
  cursor: pointer;
  border-bottom: 1px solid transparent;
  border-bottom-color: ${props => props.selected ? '#18B7D8' : 'transparent'};

  &:first-child {
    margin-left: 0;
  }
`
