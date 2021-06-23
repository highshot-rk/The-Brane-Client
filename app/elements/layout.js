import styled, { css } from 'styled-components'

export const Row = styled.div`
  display: flex;
  align-items: center;
  ${props => props.wrap && css`flex-wrap: wrap;`}
  ${props => props.justify && css`justify-content: ${props.justify};`}
  ${props => props.alignItems && css`align-items: ${props.alignItems};`}
  ${props => props.margin && css`margin: ${props.margin};`}
`

export const FullHeightRow = styled(Row)`
  display: flex;
  align-items: center;
  height: 100vh;
`

export const Filler = styled.div`
  flex-grow: 1;
`

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
  overflow: auto;
`

export const SidebarHeader = styled.div`
  width: 100%;
  height: 47px;
  background: rgba(196, 196, 196, 0.35);
  display: flex;
  align-items: center;
`

export const BoldTitle = styled.div`
  color: #2E2E2E;
  font-family: 'HK Grotesk', sans-serif;
  font-size: 16px;
  font-weight: 500;
  line-height: 22px;
  text-align: center;
  margin: 11px 0;
`
