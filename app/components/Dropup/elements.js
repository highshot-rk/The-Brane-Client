import styled, { css } from 'styled-components'
import { OVERLAY_COLOR } from 'styles/colors'

export const DropupContainer = styled.div`
  background-color: ${OVERLAY_COLOR};
  z-index: 1;
  cursor: pointer;
  ${({ isOpen }) => isOpen && css`
    position: absolute;
    width: 100vw;
    height: 100vh;
  `}
`

export const Wrapper = styled.div`
  position: absolute;
  bottom: 16px;
  right: 16px;
  box-shadow: 0 0 10px 0 $c02-dark;
  transition: 0.2s ease-in-out;
  z-index: 1;
`

export const Thumb = styled.div`
  position: absolute;
  bottom: 0;
  right: 10px;
  width: 58px;
  height: 58px;
  text-align: center;
  cursor: pointer;

  img {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    border: ${props => props.defaultImage ? 'none' : '2px solid white'};
    box-shadow: 0 0 5px 0 $c02-dark;
    background: black;
  }

  span {
    opacity: ${props => props.visibleMenu ? 1 : 0};
    transform: scale(${props => props.visibleMenu ? 1 : 0});
    transition: all 0.2s ease-in-out;
    padding-top: 20px;
    border-radius: 50%;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    position: absolute;
    top: 0;
    left: 0;
    display: inline-block;
    box-sizing: border-box;

    svg {
      width: 12.2px;
      height: 12.2px;
    }
  }
`

export const MenuContainer = styled.div`
  display: inline-flex;

  div {
    cursor: pointer;
    opacity: ${props => props.menuOpen ? 1 : 0};
    transform: scale(${props => props.menuOpen ? 1 : 0});
    transition: all 0.2s ease-in-out;
    right: 80px;
    position: absolute;
    bottom: 20px;
    width: 50px;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.1);
    height: 50px;
    background: white;
    border-radius: 50%;
    padding: 12px 0 0 12px;

    img {
      width: 25.83px;
      height: auto;
    }
  }

  div + div {
    right: 45px;
    position: absolute;
    bottom: 70px;
  }

  div + div + div {
    right: -13px;
    position: absolute;
    bottom: 80px;
  }
`
