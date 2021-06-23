import styled from 'styled-components'

export const ErrorWrapper = styled.div`
  color: white;
  font-family: HKGrotesk, sans-serif;
  max-width: 500px;
  margin: 50px auto;

  .graphs {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
`

export const Wrapper = styled.div`
  .fade-enter {
    opacity: 0.01;
  }

  .fade-enter.fade-enter-active {
    opacity: 1;
    transition: opacity 300ms ease-in;
  }

  .fade-exit {
    opacity: 1;
  }

  .fade-exit.fade-exit-active {
    opacity: 0.01;
    transition: opacity 300ms ease-in;
  }

  div.transition-group {
    position: relative;
  }
`
export const GraphBtn = styled.button`
  height: 45px !important;
  min-height: 45px;
  width: 80%;
  border-radius: 999px;
  text-align: center;
  color: #151515;
  font-family: 'IBM Plex Sans', sans-serif !important;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  margin-bottom: 14px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #74FFB4;
`
