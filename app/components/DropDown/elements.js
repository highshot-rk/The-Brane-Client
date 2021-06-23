import styled from 'styled-components'

export const Wrapper = styled.div`
  font-size: 13px;
  padding: 21px 15px;
  position: relative;
  width: 100%;
  z-index: ${props => props.expanded ? '5' : '2'};
  background-color: ${props => props.expanded ? '#E9E9E9' : '#E9E9E9'};
  cursor: pointer;
`

export const Label = styled.label`
  color: #646464;
  padding-right: 5px;
`

export const Selected = styled.span`
  display: inline-block;
  font-weight: bold;
  max-width: 140px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  vertical-align: bottom;
`

export const Drop = styled.div`
  display: block;
  width: 100%;
  background-color: white;
  position: absolute;
  left: 0;
  top: 60px;
  z-index: 5;
`

export const Section = styled.div`
  font-weight: bold;
  padding: 20px 15px;
  border-top: 0 solid #D8D8D8;
  border-top-width: ${props => props.first ? '0' : '1'}px;
`

export const Option = styled.div`
  padding: 20px 25px;
  height: 60px;
  background-color: ${props => props.selected ? '#F8F8F8' : ''};
`
export const Arrow = styled.span`
  float: right;

  svg {
    height: 16px;
    width: 16px;
    margin-right: ${props => props.expanded ? '-8px' : '0'};
    margin-top: ${props => props.expanded ? '5px' : '-10px'};
    transform: rotate(${props => props.expanded ? '180' : '0'}deg);
  }
`
