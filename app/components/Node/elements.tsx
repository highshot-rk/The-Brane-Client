import styled, { css } from 'styled-components'

export const CloseButton = styled.g`
  transform: translate(${(props: any) => props.x - 50}px, ${(props: any) => props.y}px);

  circle {
    fill: #000;
    stroke: none;
    cursor: pointer;
  }

  text {
    text-anchor: middle;
    fill: #FFF;
    font-size: 35px;
    cursor: pointer;
    user-select: none;
  }
`

export const VennCenter = styled.circle<{ menuOpen: boolean }>`
  fill: ${(props: any) => props.menuOpen ? '#392765' : '#8662DF'} !important;
`
export const WhiteCenter = styled.circle<{menuOpen: boolean}>`
  fill: ${(props: any) => props.menuOpen ? '#392765' : '#FFF'} !important;
`
export const VennText = styled.text<{menuOpen: boolean}>`
  fill: ${(props: any) => props.menuOpen ? '#5f5f5f' : '#FFF'};
`

export const ExpandHintText = styled.text`
  fill: #19B7D8;
  opacity: 0.4;
  font-size: 14px;
`

function modifyTime (props: any, time: number) {
  return props.theme.appearSpeed * time
}

export const CenterWrapper = styled.g<{initialAppear: boolean}>`
  ${(props: any) => props.initialAppear && css`
  animation-name: node_fadeIn;
  animation-fill-mode: both;
  animation-duration: ${modifyTime(props, 2)}s;
  transition: 0s transform !important;
  animation-timing-function: linear;

  circle {
    transition: 0s transform !important;
  }

  text, .node__center__brane-icon {
    animation-name: node_fadeIn;
    animation-fill-mode: both;
    animation-duration: ${modifyTime(props, 2)}s;
    animation-timing-function: linear;
  }
  `}
`

export const OrbitWrapper = styled.g<{initialAppear: boolean}>`
  > circle {
    transition: ${(props: any) => props.initialAppear ? '0' : '0.5'}s transform !important;
  }

  transition: ${(props: any) => props.initialAppear ? `0` : '0.5'}s;

  &.node__orbit--visible {
    animation-duration: ${(props: any) => props.initialAppear ? `0s, ${modifyTime(props, 1.5)}s` : '1s, 0s'} !important;
    animation-delay: ${(props: any) => props.initialAppear ? `0s, ${modifyTime(props, 2)}s` : '0s, 0s'} !important;
    ${(props: any) => props.initialAppear && css`animation-fill-mode: both !important;`}
  }
`
