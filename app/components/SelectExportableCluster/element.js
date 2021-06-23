import styled, { css } from 'styled-components'

export const Check = styled.div`
  width: 1.3rem;
  height: 1.3rem;
  background-color: #19B7D8;
  border: 1px solid #19B7D8;
  box-sizing: border-box;
  border-radius: 2px;
  position: relative;
  color: #FFF;
`
export const Col = styled.div`
  margin-left: 80px;
`
export const Cols = styled.div`
  margin-left: 100px;
`
export const Colf = styled.div`
  margin-left: 90px;
`
export const UnCheck = styled.div`
  width: 1.3rem;
  height: 1.3rem;
  border: 1px solid #9E9E9E;
  box-sizing: border-box;
  border-radius: 2px;
`
export const InputBar = styled.div`
  margin-left: 80px;
  color: #B3B3B3;
  border-bottom: 2px solid #B3B3B3;
`
export const DropDiv = styled.div`
  position: absolute;
  display: block;
  height: 150px;
  min-width: 160px;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  padding: 3px 0 1px 3px;
  margin-left: 80px;
  overflow-y: auto;
`
export const Row = styled.div`
  display: flex;
  ${props => props.wrap && css`flex-wrap: wrap;`}
  ${props => props.justify && css`justify-content: ${props.justify};`}
  ${props => props.alignItems && css`align-items: ${props.alignItems};`}
  ${props => props.margin && css`margin: ${props.margin};`}
`
export const Specify = styled.div`
  display: flex;
  position: absolute;
  margin-left: 10px;
`
export const DropBox = styled.div`
  position: relative;
  display: inline-block;
`
export const Circle = styled.div`
  width: 14px;
  height: 14px;
  background-color: #9B9B9B;
  margin-right: 2px;
  margin-top: 2px;
  border-radius: 50%;
`
export const Circl = styled.div`
  width: 14px;
  height: 14px;
  background-color: #E84F4F;
  margin-right: 2px;
  margin-top: 2px;
  border-radius: 50%;
`
export const Span = styled.span`
  font-size: 15px;
  color: white !important;
  font-weight: 300;
  margin-left: 2px;
`
export const Mark = styled.span`
  font-size: 13px;
  position: absolute;
  right: 20%;
`
