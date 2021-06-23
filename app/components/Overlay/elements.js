import styled from 'styled-components'
import { OVERLAY_COLOR } from 'styles/colors'
export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${(props) => props.transparent ? 0 : 100};
  background-color: ${OVERLAY_COLOR};
  z-index: 1;
`
