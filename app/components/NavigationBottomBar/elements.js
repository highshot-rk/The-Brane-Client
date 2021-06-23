import styled from 'styled-components'

export const Container = styled.div`
  position: absolute;
  bottom: 10px;
  margin: 0 auto;
  left: 0;
  right: 0;
  background-color: rgba(32, 32, 32, 1);
  width: 252px;
  border-radius: 2px;
  display: flex;
  align-items: center;
  height: 60px;
  padding: 15px;
  opacity: 0.3;
  transition: opacity 0.15s ease-in-out 0s;
  user-select: none;

  &:hover {
    opacity: 1;
  }

  h1 {
    font-family: HKGrotesk, serif;
    font-size: 13px;
    color: #8F8F8F;
    text-align: right;
    line-height: 0;
    flex: 1;
    flex-grow: 1;
  }

  div {
    flex: 1;
  }
`

export const ActionImg = styled.img`
  width: 16px;
  height: 16px;
  margin: 0 ${props => props.rotated ? '0' : '8px'};
  flex: 1;
  cursor: pointer;
`

export const Action = styled.div`
  flex: 1;
  cursor: pointer;
  margin: 0 8px;
  display: flex;
  align-items: center;
`

export const ToggleOrbitContainer = styled.svg`
  padding-top: 2px;
  cursor: pointer;
`
