import styled from 'styled-components'

export const LinkTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: 15px;

  div {
    font-weight: 700;
  }
`

export const VerbSelectorWrapper = styled.div`
  z-index: 2;
`

export const Back = styled.div`
  position: absolute;
  top: 3px;
  left: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #54A1D3;

  img {
    height: 20px;
    margin: 0 5px;
  }

  span {
    font-size: 12px;
  }
`
