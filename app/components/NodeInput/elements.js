import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
  margin-bottom: ${props => props.errorText ? 20 : 0}px;
`

export const Suggestion = styled.span`
  font-size: 14px;
  padding: 5px;
  cursor: pointer;
  display: flex;
  flex: 1;

  :hover {
    background-color: #CCC;
  }
`

export const Clear = styled.div`
  position: absolute;
  right: 1px;
  top: 1px;
  height: 48px;
  width: 20px;
  cursor: pointer;
  text-align: center;
  line-height: 48px;
`
