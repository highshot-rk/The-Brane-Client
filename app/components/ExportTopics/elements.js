import styled from 'styled-components'

export const Drop = styled.div`
  position: absolute;
  bottom: 71px;
  margin: 0 auto;
  left: 88px;
  right: 0;
  background-color: #4A4A4A;
  width: 162px;
  box-shadow: 0 1px 2px 0 rgba(69, 69, 69, 0.41);
  display: flex;
  align-items: center;
  z-index: 5;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    li {
      font-family: HKGrotesk, 'HK Grotesk', sans-serif;

      &:first-child {
        color: #979797;
        font-weight: bold;
        font-family: 'Lucida Grande', sans-serif;
      }

      img {
        margin-left: 2rem;
      }
    }
  }

  li {
    padding: 0 15px;
    font-size: 14px;
    font-weight: normal;
    font-family: Karla, sans-serif;
    color: white;
    line-height: 34px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
      opacity: 0.8;
    }

    img {
      height: 16px;

      &.Slack-icon {
        height: 19px;
      }
    }
  }
`
