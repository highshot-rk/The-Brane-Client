import { createGlobalStyle } from 'styled-components'
import { BG_ALT } from './colors'

export default createGlobalStyle`
  body {
    background-color: ${BG_ALT};
    overflow: hidden;
  }

  html,
  body {
    height: 100%;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin: 0;
    padding: 0;
  }

  .btn {
    font-family: HKGrotesk-Regular, sans-serif;
    font-size: 14px;
    text-align: center;
    line-height: 14px;
    border-radius: 6px;
    padding: 12px 20px;
    min-width: 130px;
  }

  ::-webkit-scrollbar {
    width: 5px;
    height: 5px;

    &-thumb {
      border-radius: 10px;
      background-color: #222;
    }

    &-track {
      background-color: #EAEAEA;
    }
  }
`
