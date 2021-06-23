import styled from 'styled-components'

export const SwitchWrapper = styled.label`
  position: relative;
  display: inline-block;
  width: 21px;
  height: 13px;

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #F2F2F2;
    transition: 0.4s;
    border-radius: 13px;
    border: 1px solid #2D2D2D;
    width: 100%;

    &::before {
      position: absolute;
      content: '';
      height: 13px;
      width: 13px;
      left: -1px;
      top: -1px;
      border: 1px solid #2D2D2D;
      background-color: #F2F2F2;
      transition: 0.4s;
      border-radius: 50%;
    }
  }

  input {
    display: none;

    &:checked {
      + {
        .slider {
          background-color: #2D2D2D;

          &::before {
            transform: translateX(8px);
          }
        }
      }
    }

    &:focus {
      + {
        .slider {
          box-shadow: 0 0 1px #2D2D2D;
        }
      }
    }
  }
`
