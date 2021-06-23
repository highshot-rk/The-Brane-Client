import styled, { css } from 'styled-components'

export const PopupContainer = styled.div`
  background-color: ${props => props.bgColor};
  color: ${props => props.textColor};
  top: 100vh;
  padding: 0;
  height: 0;
  opacity: 0;
  box-shadow: -1px 11px 20px 0 rgba(31, 30, 30, 0.5);
  overflow: hidden;
  width: auto;
  font-size: 14px;
  font-weight: 300;
  font-family: HKGrotesk, sans-serif;
  border-radius: 3px;
  position: absolute;
  right: 20px;
  z-index: 10;
  transition: all 0.2s ease-in-out 0s;
  ${props => props.show && css`
    top: 86vh;
    padding: 20px 0 0px 15px;
    height: 50px;
    opacity: 1;
  `}
  h5 {
    line-height: 0.5;
    margin-right: 100px;
  }

  svg {
    position: absolute;
    right: 8px;
    top: 8px;
    cursor: pointer;
  }
`
