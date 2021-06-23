import styled from 'styled-components'

export const Tabs = styled.div`
  margin-top: 14px;
  display: flex;
  align-items: center;
  font-size: 15px;
  overflow-x: auto;
  padding: 0 15px;
  min-height: 35px;

  button {
    white-space: nowrap;
  }
`

export const StatsTable = styled.table`
  font-size: 14px;
  margin: 11px 45px 30px 45px;
  width: calc(100% - 90px);
  font-weight: 500;

  td:last-child {
    text-align: right;
  }
`
