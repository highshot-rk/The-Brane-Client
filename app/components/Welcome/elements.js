import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

export const Text = styled.h1`
  position: absolute;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -300px);
  color: white;
  font-family: HKGrotesk, sans-serif;
  font-weight: 300;
  animation: ${fadeIn} ${props => 2 * props.theme.appearSpeed}s;
  animation-fill-mode: both;
  animation-delay: ${props => 3.5 * props.theme.appearSpeed}s;
  animation-timing-function: linear;
  opacity: 0;
  white-space: nowrap;
  z-index: 1;
`
