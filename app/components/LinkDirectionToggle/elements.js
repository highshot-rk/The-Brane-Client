import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  color: #8662DF;
  cursor: pointer;
  margin-right: 15px;
  user-select: none;

  span {
    padding: 3px;

    &.label {
      text-decoration: underline;
    }
  }
`
