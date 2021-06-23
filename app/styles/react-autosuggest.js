import { createGlobalStyle } from 'styled-components'

export default createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Montserrat:200,300,300i');

  .react-autosuggest__container {
    flex: 1;
    position: relative;
    border-radius: 2px;

    .react-autosuggest__input {
      &::placeholder {
        color: #7C7C7C;
      }
    }

    .react-autosuggest__suggestions-list {
      position: absolute;
      background-color: white;
      bottom: 0;
      margin: 0;
      list-style-type: none;
      padding: 10px;
      border: 1px solid black;
      max-height: 300px;
      overflow-y: scroll;
      z-index: 2;
      transform: translateY(100%);
    }

    .Select-control {
      margin: 0 !important;
    }

    .Select-input {
      padding-top: 0 !important;
    }

    .Select-placeholder {
      padding: 5px 10px !important;
    }
  }
`
