import styled, { keyframes } from 'styled-components'

export const Search = styled.div`
  img {
    width: 18px;
    height: 18px;
    position: absolute;
    margin-left: 23px;
    margin-top: 20px;
  }

  input {
    font-size: 13px;
    padding: 23px 60px;
    padding-right: 0;
    width: 350px;
    height: 60px;
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    margin-left: auto;
    margin-right: auto;
    text-align: left;
    border: 1px solid #FFF;
    border-radius: 2px;
    outline: none;

    &::placeholder {
      color: white;
      opacity: 1;
    }
  }
`
const fadeIn = keyframes`
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
`

export const SearchWrapper = styled.div`
  position: absolute;
  left: 50vw;
  bottom: 220px;
  transform: translate(-50%, 200px);
  animation: ${fadeIn} ${props => 2 * props.theme.appearSpeed}s;
  animation-fill-mode: both;
  animation-timing-function: linear;
  animation-delay: ${props => 3.5 * props.theme.appearSpeed}s;
`
