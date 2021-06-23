import styled from 'styled-components'

export const Tag = styled.div`
  margin-left: 0.1px !important;

  #tags {
    display: flex;
    flex-wrap: wrap;
    padding: 0;
    margin: 8px 0 0 0;
  }

  .tag {
    width: auto;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: BLACK;
    padding: 0 7px;
    font-size: 14px;
    list-style: none;
    border-radius: 99px;
    border: 1px solid #BFC7D1;
    margin: 0 8px 8px 0;
    background-color: #F5F7FB;

    .tag-title {
      margin-top: 3px;
      font-family: 'IBM Plex Sans', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 12px;
      line-height: 14px;
    }

    .tag-close-icon {
      display: block;
      width: 6px;
      height: 6px;
      line-height: 16px;
      font-size: 14px;
      margin-right: 7px;
      margin-bottom: 8px;
      color: black;
      border-radius: 50%;
      background: #FFF;
      cursor: pointer;
    }
  }
`

export const TagsInput = styled.div`
  display: flex;
  background-color: #FFF;
  align-items: flex-start;
  flex-wrap: wrap;
  min-height: 48px;
  width: 100%;
  padding: 0 8px;
  border: 1px solid rgb(214, 216, 218);
  border-radius: 2px;
  margin: 0.1px;

  &:focus-within {
    border: 1px solid #0052CC;
  }

  input {
    flex: 1;
    border: none;
    height: 46px;
    font-size: 14px;
    padding: 4px 0 0 0;

    &:focus {
      outline: transparent;
    }
  }
`
