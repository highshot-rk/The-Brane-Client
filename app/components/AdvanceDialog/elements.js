import styled from 'styled-components'

export const Container = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
`

export const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: HKGrotesk, sans-serif;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
`

export const Window = styled.div`
  position: absolute;
  min-width: 825px;
  padding-bottom: 35px;
  background: white;
  border-radius: 2px;
  overflow-y: auto;
`

export const Download = styled.div`
  background-color: #54A1D3;
  margin-top: 20;
  margin-bottom: -35px;
`

export const Content = styled.div`
  margin-top: 0;
  margin-left: 26px;
  font-size: 13px;
  white-space: pre-wrap;
  padding: 30 30 0 30;
`

export const Title = styled.div`
  height: 31px;
  font-family: 'HK Grotesk', sans-serif;
  color: #4D4D4D;
  font-size: 26px;
  font-weight: bold;
  line-height: 30;
  margin-top: 15px;
  padding: 30;
`

export const SubWrapper = styled.div`
  padding-top: 20;
`

export const SubContent = styled.div`
  padding-top: 15px;
`
export const Element = styled.div`
  padding-left: 32px;
`

export const Checkbox = styled.input`
  margin-right: 20;
  font-size: 10;
  height: 13px !important;
  width: 13px !important;
`

export const SubTitle = styled.span`
  font-family: HKGrotesk, sans-serif;
  font-size: 16px;
  line-height: 18px;
  color: #646464;
`

export const Span = styled.span`
  font-size: 13px;
  margin-right: 30;
`

export const Select = styled.select`
  height: 20;
  width: 120;
  opacity: 0.8;
  color: #1987D8;
  font-size: 13px;
  font-weight: 300;
  border-bottom: 2px solid #19B7D8;
  margin-left: 140;
`

export const Input = styled.input`
  height: 25px;
  border-bottom: 2px solid rgba(151, 151, 151, 0.89);
  font-size: 16px;
  width: 100;
  margin-left: 20;

  &:focus {
    outline: none;
  }
`

export const Button = styled.button`
  border-radius: 2px;
  font-size: 12px;
  text-transform: uppercase;
  line-height: 18px;
  text-align: center;
  height: auto;
  float: right;
  margin-left: 12px;
  outline: none;
  font-weight: bold;
  padding: 5px;

  &:hover {
    opacity: 0.9;
  }
`
export const DownloadTitle = styled.div`
  padding: 30 0 0 30;
`
export const DownloadContent = styled.div`
  padding: 10 0 20 50;
`
export const DownloadButton = styled.button`
  float: right;
  margin-right: 50;
  background-color: #FFF;
  padding: 3px 7px 3px 7px;
  color: #54A1D3;
  line-height: 15px;

  &:hover {
    opacity: 0.9;
  }
`

export const ExportWindow = styled.div`
  position: absolute;
  min-width: 825px;
  background: white;
  border-radius: 2px;
`

export const ExportContent = styled.div`
  margin-right: 30;
`

export const ExportIcon = styled.span`
  margin-right: 2px;
`

export const InputBar = styled.div`
  height: 25px;
  border-bottom: 2px solid rgba(151, 151, 151, 0.89);
  font-size: 14px;
  margin-left: 20;

  &:focus {
    outline: none;
  }

  width: 140;
  float: right;
`
export const Drop = styled.div`
  margin-top: 5px;
  height: 100;
  border: 1px solid LightGray;
  font-size: 12px;
  overflow-y: auto;
  width: 200;
`
export const Ul = styled.ul`
  padding: 0 0 0 0;
  margin: 0 0 0 0;
  list-style-type: none;
`
export const ButtonIcon = styled.button`
  border-radius: 50%;
  width: 8px;
  height: 8px;
  font-size: 14px;
  margin-right: 2px;
`
export const Check = styled.div`
  margin-left: 40;
  width: 13px;
  height: 13px;
  background-color: #19B7D8;
  border-radius: 50%;
`
export const ManageButton = styled.button`
  color: #1987D8;
  font-size: 15px;
  padding-top: 0;
  padding-bottom: 0;

  &:focus {
    outline: none;
  }

  &:hover {
    opacity: 0.6;
  }
`
export const SubExport = styled.div`
  margin-left: 30;
`
export const DownFile = styled.div`
  font-family: HKGrotesk, sans-serif;
  padding: 3px 17px 3px 17px;
  border-radius: 100;
  font-size: 13px;
  line-height: 15px;
  margin-right: 30;
  margin-bottom: 20;
  display: flex;
  align-items: center;
  color: white;
  background: #83C686;
  border: 1px solid #83C686;
`
export const DownFileSuccess = styled.div`
  font-family: HKGrotesk, sans-serif;
  padding: 3px 17px 3px 17px;
  border-radius: 100;
  font-size: 13px;
  line-height: 15px;
  margin-right: 30;
  margin-bottom: 20;
  display: flex;
  align-items: center;
  color: #9B9B9B;
  background: white;
  border: 1px solid #9B9B9B;
`
export const ButtonWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 500;

  * {
    -webkit-touch-callout: none; /* iOS Safari */
    user-select: none;
  }
`
export const DownIcon = styled.div`
  font-size: 20;
  margin-left: 8px;
  color: white;
`
export const DownIconSuccess = styled.div`
  font-size: 20;
  margin-left: 8px;
  color: #9B9B9B;
`
