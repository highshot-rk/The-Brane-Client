import styled from 'styled-components'

export const Container = styled.div`
  height: 100%;
  overflow-y: auto;
  font-size: ${(props) => props.condensed ? '13px' : '14px'};
`

export const Section = styled.div`
  padding: 21px 15px;
`

export const BreadCrumbs = styled.div`
  padding-top: 10px;
`

export const Search = styled.input`
  border: none;
  height: 18px;
  width: 100%;
  padding-bottom: 4px;
  padding-left: 0;
  outline: none;
  border-bottom: 1px solid #E7E7E7;
  font-size: 14px;
`

export const Separator = styled.div`
  height: 0;
  width: 260px;
  margin-left: auto;
  margin-right: auto;
  border-bottom: 1px solid #CCC;
`

export const Clear = styled.div`
  padding: 21px 15px;
  color: #646464;
  font-size: 13px;
  cursor: pointer;

  &:hover {
    background-color: rgb(233, 233, 233);
  }

  span {
    font-size: 33px;
    vertical-align: text-bottom;
    font-family: serif;
    padding-right: 10px;
  }

  div {
    display: inline-block;
    float: right;
  }
`

export const AutoFilter = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-bottom: -25px;
  margin-top: 7px;
  margin-right: 10px;

  span {
    padding-right: 9px;
    color: #2D2D2D;
    font-size: 11px;
    font-weight: 800;
    padding-bottom: 2px;
  }

  label {
    margin-top: 2px;
  }
`
