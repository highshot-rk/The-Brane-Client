import styled from 'styled-components'

export const Tab = styled.button`
  height: auto;
  padding: 3px 0;
  color: #444;
  border-bottom: 2px solid ${props => props.selected ? '#18B7D8' : 'transparent'};
  opacity: ${props => props.selected ? '1' : '0.4'};
  margin-right: 15px;
  outline: none;
`

export const BoldSeperator = styled.hr`
  width: 100%;
  border: 1px solid #979797;
  margin: 0;
`
