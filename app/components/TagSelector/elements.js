import styled from 'styled-components'
import {
  THEME_DEFAULT,
} from 'styles/colors'

export const TagInput = styled.div`
  .Select-control {
    border: 1px solid ${props => props.error ? 'red' : 'rgba(151, 151, 151, 1)'};
    border-radius: 0 2px 0 2px;
    font-family: HKGrotesk, sans-serif;
    height: 50px;
    margin-left: 2px;
  }

  .Select-menu-outer {
    max-height: 400px;
    height: auto;
    z-index: 2;
  }

  .Select-menu {
    max-height: 398px;
  }

  .Select-placeholder {
    color: #C6C6C6;
    font-family: HKGrotesk, sans-serif;
    padding: 5px;
    line-height: 38px;
  }

  .Select-input > input {
    height: auto;
  }

  .Select--multi .Select-multi-value-wrapper,
  .Select--multi .Select--multi-value-wrapper {
    height: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }

  .Select--multi .Select-value {
    display: inline-block;
    border-radius: 100px;
    background: transparent;
    padding: 3px 20px;
    font-size: 13px;
    margin: 5px;
    border-color: ${THEME_DEFAULT};
    color: ${THEME_DEFAULT};

    .Select-value-label,
    .Select-value-icon {
      font-size: 13px;
      line-height: 1;
    }

    .Select-value-icon {
      float: right;
      display: none;
      border: none;
      vertical-align: middle;
      padding-top: 3px;
      padding-bottom: 0;
      padding-left: 4px;
      padding-right: 4px;

      &:hover {
        background: transparent;
        color: white;
      }
    }

    &:hover {
      padding-right: 5px;

      /* Prevents following tags from jumping */
      border-right-width: 0;
      color: white;
      background-color: ${THEME_DEFAULT};

      .Select-value-icon {
        display: inline-block;
      }
    }
  }

  .Select--multi .Select-input {
    padding: 5px 0;
    margin-left: 6px;
    height: auto;

    input {
      padding: 0;
    }
  }
`
