import styled from 'styled-components'

export const Section = styled.div`
  color: #646464;
  margin-top: 25px;
  font-size: 14px;
`

export const Title = styled.div`
  padding-left: 6px;
  padding-bottom: 5px;
  border-bottom: 2px solid #979797;
`

export const List = styled.div`
  padding: 10px 0 0 0;
`

export const Color = styled.div`
  background-color: ${props => props.background};
  border: 1px solid #979797;
  border-radius: 5px;
  width: 18px;
  height: 18px;
  margin-left: auto;
  margin-right: 9px;
`

export const PropertyTitle = styled.span`
  && {
    color: #646464;
  }
`
