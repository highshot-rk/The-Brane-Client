import styled, { css } from 'styled-components'

export const Title = styled.div`
  height: 31px;
  font-family: 'HK Grotesk', sans-serif;
  color: #4D4D4D;
  font-size: 26px;
  font-weight: bold;
  line-height: 31px;
  margin-top: 15px;
  padding: 52px;
`
export const SubTitle = styled.span`
  font-family: 'HK Grotesk', sans-serif;
  font-size: 16px;
  line-height: 18px;
  color: #646464;
`
export const Content = styled.div`
  margin-top: 15px;
  padding-right: 55px;
  padding-left: 55px;
`

export const TableTitle = styled.div`
  font-size: 20px;
  font-weight: 300;
  text-align: center;
`
export const Button = styled.button`
  font-family: HelveticaNeue, sans-serif;
  font-size: 12px;
  line-height: 14px;
  text-align: center;
  color: white;
  float: right;
  margin-right: 40px;
  margin-top: 58px;
  background-color: #54A1D3;
  border-radius: 2px;
  padding: 12px 30px 13px 30px;
  margin-bottom: 35px;

  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 0.8;
  }
`

export const Cancel = styled.button`
  font-family: Karla, sans-serif;
  font-style: normal;
  font-weight: bold;
  font-size: 14px;
  line-height: 14px;
  text-align: right;
  color: #54A1D3;
  float: right;
  margin-right: 10px;
  margin-top: 58px;
  margin-bottom: 35px;

  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 0.8;
  }
`
export const CirclePlus = styled.div`
  width: 14px;
  height: 14px;
  background-color: #18B7D8;
  margin-right: 2px;
  margin-top: 5px;
  border-radius: 50%;
  text-align: center;
  color: #FFF;
  position: relative;
`
export const CircleMin = styled.div`
  width: 14px;
  height: 14px;
  background-color: #9B9B9B;
  margin-right: 2px;
  margin-top: 5px;
  border-radius: 50%;
  text-align: center;
  color: #FFF;
  position: relative;
`
export const CircleRed = styled.div`
  width: 14px;
  height: 14px;
  background-color: red;
  margin-right: 2px;
  margin-top: 5px;
  border-radius: 50%;
  text-align: center;
  color: #FFF;
  position: relative;
`
export const Row = styled.div`
  display: flex;
  ${props => props.wrap && css`flex-wrap: wrap;`}
  ${props => props.justify && css`justify-content: ${props.justify};`}
  ${props => props.alignItems && css`align-items: ${props.alignItems};`}
  ${props => props.margin && css`margin: ${props.margin};`}
`
export const Span = styled.span`
  font-size: 15px;
  font-weight: bolder;
  position: absolute;
  right: 20%;
`
export const ButtonGroup = styled.div`
  margin-bottom: 30px;
`
export const Mark = styled.span`
  font-size: 13px;
  position: absolute;
  right: 20%;
`
export const Main = styled.div`
  position: relative;
  height: 60%;
  width: 100%;
`
export const Available = styled.div`
  float: left;
  width: 50%;
  border: 1px solid gray;
  height: 350px;
  overflow-y: auto;
`
export const Selected = styled.div`
  float: left;
  width: 50%;
  border-top: 1px solid gray;
  border-right: 1px solid gray;
  border-bottom: 1px solid gray;
  height: 350px;
  overflow-y: auto;
`
export const Input = styled.input`
  height: 40px;
  width: 90%;

  &:focus {
    outline: none;
  }
`
export const SearchWrap = styled.div`
  border: 1px solid gray;
`
export const AvailableTap = styled.div`
  float: left;
  width: 50%;
  border: 1px solid gray;
  height: 50px;
  padding-top: 10px;
`
export const SelectedTap = styled.div`
  float: right;
  width: 50%;
  border: 1px solid gray;
  height: 50px;
  padding-top: 10px;
`
