import styled, { css } from 'styled-components'

export const Main = styled.div`
  position: relative;
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

export const Available = styled.div`
  float: left;
  width: 50%;
  border: 1px solid gray;
  height: 320px;
  overflow-y: auto;
`
export const Selected = styled.div`
  float: left;
  width: 50%;
  border-top: 1px solid gray;
  border-right: 1px solid gray;
  border-bottom: 1px solid gray;
  height: 320px;
  overflow-y: auto;
`

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
  font-family: HelveticaNeue, sans-serif;
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

  span {
    font-size: 1.3rem;
    font-weight: 200;
    vertical-align: middle;
    line-height: 0.4;
  }
`
export const CirclePlus = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  padding: 0.3rem 0.2rem 0 1.4rem;
  background-color: #18B7D8;
  margin: 0 0.5rem;
  border-radius: 50%;
  text-align: center;
  color: #FFF;
  position: relative;
  z-index: 20;
`
export const CircleMin = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  padding: 0.3rem 0.2rem 0 1.4rem;
  background-color: #9B9B9B;
  margin: 0 0.5rem;
  border-radius: 50%;
  text-align: center;
  color: #FFF;
  position: relative;
  z-index: 20;
`
export const CircleRed = styled.div`
  width: 1.5rem;
  height: 1.5rem;
  padding: 0.25rem 0 0 0;
  margin: 0 0.5rem;
  background-color: red;
  border-radius: 50%;
  text-align: center;
  color: #FFF;
  position: relative;
`
export const Row = styled.div`
  display: flex;
  z-index: 10;
  ${props => props.wrap && css`flex-wrap: wrap;`}
  ${props => props.justify && css`justify-content: ${props.justify};`}
  ${props => props.alignItems && css`align-items: ${props.alignItems};`}
  ${props => props.color && css`background: ${props.color};`}
  padding: 0.3rem;
`
export const Plus = styled.span`
  font-size: 1.4rem;
  font-weight: bolder;
  position: absolute;
  right: 20%;
`
export const Minus = styled.span`
  font-size: 1.8rem;
  font-weight: bolder;
  position: absolute;
  right: 22.5%;
`
export const Mark = styled.span`
  font-size: 1.2rem;
  position: absolute;
  right: 20%;
`
export const Property = styled.div`
  background: rgba(196, 196, 196, 0.2);
  width: 50%;
  margin-top: 0;
  min-height: 418px;
`
export const Cluster = styled.div`
  width: 50%;
  border-right: 1px solid #E7E7E7;
`
export const PropertyTitle = styled.span`
  font-size: 15px;
  font-weight: 300;
`
export const PropertyDiv = styled.div`
  width: 50%;
  text-align: center;
  padding-left: 20px;
`
export const Line = styled.hr`
  margin-bottom: 0;
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

export const Menu = styled.div`
  position: absolute;
  background: white;
  z-index: 10000;
  border: 1px solid gray;
  width: 300px;
  max-height: 300px;
  overflow-y: auto;
`
