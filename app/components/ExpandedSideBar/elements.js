import styled from 'styled-components'

export const Drop = styled.div`
  width: 160px;
  background: #202020;
  position: absolute;
  left: 60px;
  bottom: 0;
  z-index: 5;
  color: #FFF;
  padding: 9px 0;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    padding: 0 15px;
    font-size: 14px;
    font-weight: normal;
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
