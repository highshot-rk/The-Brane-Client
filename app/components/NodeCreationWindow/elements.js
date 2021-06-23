import styled from 'styled-components'

export const Wrapper = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  padding: 0;
  height: 100%;
  ${props => props.zIndex ? `z-index: ${props.zIndex};` : ''}
`

export const Window = styled.div`
  padding: 25px;
  background: white;
  border-radius: 2px;
  width: 80%;
  max-width: 800px;
  max-height: 80%;
  z-index: 4;
  margin-top: 40px;
  margin-bottom: 40px;
  overflow-y: scroll;
`

export const LinkCreationLink = styled.div`
  font-weight: 300;
  font-size: 12px;
  color: #54A1D3;
  position: absolute;
  top: 0;
  right: 0;
  cursor: pointer;

  img {
    margin-right: 5px;
    width: 20px;
    padding-top: -4px;
  }

  span {
    font-size: 12px;
    line-height: 12px;
    vertical-align: middle;
  }
`

export const Label = styled.label`
  color: #646464;
  display: flex;
  align-items: center;

  input {
    border-radius: 2px;
    margin-right: 8px;
  }
`
