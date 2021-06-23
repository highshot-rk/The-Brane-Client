import styled from 'styled-components'

export const Wrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 12;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
`

export const Window = styled.div`
  position: absolute;
  min-width: 400px;
  max-width: 550px;
  max-height: 80vh;
  overflow-y: auto;
  background: white;
  border-radius: 2px;
  padding: 25px;
`

export const Title = styled.div`
  height: 28px;
  color: #313236;
  font-size: 12px;
  font-weight: bold;
  line-height: 14px;
  margin-top: 15px;
`

export const Content = styled.div`
  margin-bottom: 35px;
  line-height: 17px;
  margin-top: 0;
  color: #888B94;
  font-size: 14px;
  white-space: pre-wrap;
`

export const Button = styled.button`
  min-width: ${props => props.buttonStyle === 'transparent' ? '0' : '82px'};
  border-radius: 2px;
  background-color:
    ${({ buttonStyle, negative }) => buttonStyle === 'transparent' ? 'transparent'
    : negative ? '#E84F4F'
      : buttonStyle === 'cta'
        ? '#54A1D3'
        : '#B9C2C6'
};
  color: ${props => props.buttonStyle !== 'transparent' ? '#FFF' : props.negative ? '#E84F4F' : '#54A1D3'};
  font-size: 12px;
  text-transform: uppercase;
  line-height: 18px;
  text-align: center;
  height: auto;
  padding: 9px ${props => props.buttonStyle === 'transparent' ? '7px' : '35px'};
  float: right;
  margin-left: 12px;
  outline: none;
  font-weight: bold;

  &:hover {
    opacity: 0.9;
  }
`
