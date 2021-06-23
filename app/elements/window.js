import styled from 'styled-components'

export const WindowWrapper = styled.div`
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
  position: relative;
  z-index: 4;
  background: white;
  width: ${props => props.width || '80%'};
  height: ${props => props.height || 'auto'};
  box-shadow: 1px 0 3px #222;
  border-radius: ${({ frameless }) => frameless ? '0' : '2px'};
  padding: ${({ frameless, padding }) => padding || (frameless ? '0' : '25px')};
  max-width: ${props => props.width || '800px'};
  max-height: 80%;
  margin: ${props => props.margin || '40px 0'};
  overflow-y: ${({ allowOverflow }) => allowOverflow ? 'visible' : 'auto'};

  @media (max-width: 768px) {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: none;
    max-height: none;
    display: flex;
    flex-direction: column;
  }
`

export const WindowHeader = styled.h1`
  position: relative;
  font-family: HKGrotesk, sans-serif;
  font-size: 26px;
  color: #4D4D4D;
  text-align: center;
  line-height: 1em;
  font-weight: 500;
  margin-top: 21px;
  margin-bottom: 50px;
`

export const Popup = styled.div`
  border-radius: 2px;
  box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
`
