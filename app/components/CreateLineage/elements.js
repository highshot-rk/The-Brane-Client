import styled from 'styled-components'

export const Row = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`

export const LinkRow = styled(Row)`
  color: #979797;
  margin-bottom: 10px;

  .nodeTitle {
    flex-grow: 1;
    text-align: center;
  }
`

export const ParentChildToggle = styled.div`
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

export const Remove = styled.button`
  font-weight: bold;
`
