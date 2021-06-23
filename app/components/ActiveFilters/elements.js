import styled from 'styled-components'

export const Container = styled.div`
  cursor: pointer;
  padding: 20px;
  background-color: #282828;
  color: white;
  min-width: 100px;
  display: flex;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 60px;
  z-index: 1;
  opacity: 0.9;
  font-size: 11px;
  align-items: center;
`
export const FilterList = styled.div`
  font-size: 13px;
`

export const Label = styled.div`
  display: inline-block;
  padding-left: 20px;
  opacity: 0.6;
  min-width: 90px;
`

export const Close = styled.div`
  padding: 0 5px;
  opacity: 0.6;
  font-size: 25px;
  line-height: 10px;

  &:hover {
    opacity: 1;
  }
`
