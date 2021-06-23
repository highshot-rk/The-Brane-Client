import styled from 'styled-components'

export const SidebarMenu = styled.div`
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 60px;
  top: 0;
  width: ${props => props.width};
  height: ${props => props.autoHeight ? 'auto' : '100%'};
  max-height: 100%;
  background: ${props => props.background || '#fff'};
  z-index: 2;
`
