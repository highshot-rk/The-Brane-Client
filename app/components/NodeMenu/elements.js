import styled, { css } from 'styled-components'

export const NodeMenu = styled.g`
  rect {
    cursor: pointer;
    opacity: 0;
  }

  text {
    transform: translate(-6px, 8px);
  }

  &.node-menu-animation-appear {
    opacity: 0;

    &.node-menu-animation-appear-active {
      transition: opacity 0.297s ease-in;
      transition-delay: 0.03s;
      opacity: 1;
    }
  }
`

export const NodeItem = styled.g`
  cursor: pointer;
  ${({ itemName, orbitLocked, fillIcon }) => {
    switch (itemName) {
      case 'restore':
      case 'collapse':
      case 'backHome':
        return css`
            path {
            transform: scale(0.5, 0.5) translate(-58px, -58px);
            fill: ${fillIcon};
            }`
      case 'read':
        return css`
            path {
              transform: scale(1.2,1.2) translate(-13px,-9px);
              fill: ${fillIcon};
            }`
      case 'explore':
        return css`
            path {
              transform: scale(0.5,0.5) translate(-34px,-26px);
              fill: ${fillIcon};
            }`
      case 'lockOrbit':
        let lockStyle = orbitLocked ? css`
            & > g {
            transform: scale(0.5, 0.5) translate(-60px, -60px);
            path {
              fill: ${fillIcon};
            }
            } 
            circle {
              fill: #FF726B;
            }` : css`
            & > g {
              transform: scale(0.5, 0.5) translate(-60px, -60px);
              path {
                fill: ${fillIcon};
              }
            } 
`
        return lockStyle
        // no default
    }
  }}
`
