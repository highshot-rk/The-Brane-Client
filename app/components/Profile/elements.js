import styled, { css } from 'styled-components'
import { AddRowButton } from 'elements/form'

const colors = {
  light: '#FFF',
  regular: '#F4F4F4',
  dark: '#DDD',
  darkest: '#979797',
  light2: '#646464',
  light3: '#aaaaaa',
  light4: '#E9E9E9',
  regular2: '#3C3C3C',
  dark2: '#2E2E2E',
  blueLight: '#19B7D8',
  blueBright: '#00B0FF',
}

export const HeaderWrapper = styled.div`
  display: flex;
  min-height: 270px;
  align-items: flex-end;
  position: relative;
  border-bottom: 1px solid ${colors.light4};

  .dropzonePicture {
    margin-left: 88px;
    border-radius: 50%;
    z-index: 1;
  }

  .dropzoneCover {
    /* Overrides styling done by dropzone */
    position: absolute !important;
    top: 0;
    width: 100%;
    z-index: 0;
  }

  .dropzoneCover.active {
    div {
      border: solid 3px green;
    }
  }

  .dropzonePicture.active {
    background: green;
  }

  button {
    &:focus {
      outline: none;
    }
  }
`

export const HeaderBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 226px;
  background-image: url(${({ headerImage }) => headerImage});
  background-size: cover;
`

export const Toolbar = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 80px;
  height: 43px;
`

export const EditImageOverlay = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  flex-direction: column;
  top: 116px;
  padding: 34px 9px;
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-color: #4A4A4AB3;
  transform: scale(0);
  opacity: 0;
  ${({ active }) => active && css`
    cursor: pointer;
    transform: scale(1);
    opacity: 1;
  `}
  transition: all 0.2s ease;
  transition-property: transform, opacity;
  ${({ header }) => header && css`
    top: 0;
    width: 100%;
    height: 226px;
    border-radius: 0;
    padding-top: 70px;
  `}
  ${({ edited }) => edited && css`
    cursor: pointer;
    opacity: 0;

    &:hover {
      opacity: 1;
    }
  `}

  img {
    width: 50px !important;
    height: 50px !important;
    background: transparent !important;
    padding: 0 !important;
    border-radius: 0 !important;
  }

  span {
    font-size: 10px;
    line-height: 1;
    color: white;
  }
`
export const Thumb = styled.div`
  text-align: center;
  padding: 3px;
  height: auto;

  img {
    padding: ${props => props.default ? '15px' : '0'};
    background: #000;
    width: 150px;
    height: 150px;
    border-radius: 50%;
  }
`

export const InputWrapper = styled.div`
  margin-bottom: 11px;
  border-radius: 2px;
  border: 1px solid #999;
  position: relative;
  color: #2E2E2E;
  background: white;

  img {
    position: absolute;
    left: 0;
    right: 0;
    border-right: ${props => props.transparentIcon ? '1px solid #979797' : ''};
    padding: ${props => props.transparentIcon ? '8px 10px' : '0'};
    height: ${props => props.transparentIcon ? 'auto' : '30px'};
  }

  input {
    width: 100%;
    background-color: white;
    outline: none;
    padding: 0 5px;
    font-size: ${props => props.large ? '18px' : '13px'};
    height: 29px;
  }

  img + input {
    padding-left: 35px;
  }

  textarea {
    width: 100%;
    background-color: white;
    outline: none;
    padding: 5px;
    font-size: 13px;
    display: block;
  }

  textarea + p {
    text-align: right;
    margin: 0 auto;
    margin-right: 10px;
    font-size: 11px;
    color: #2E2E2E;
  }

  button {
    margin: -2px -11px;
    padding: 6px 5px;
    line-height: 0;
    position: absolute;
    font-size: 10px;
    background: red;
    border-radius: 50%;
    height: 15px;
    width: 15px;
    color: white;
  }
`

export const SideBar = styled.div`
  min-width: 317px;
  max-width: 317px;
  padding-left: ${props => props.editing ? '37px' : '40px'};
  padding-right: ${({ editing }) => editing ? '37px' : '40px'};
  padding-top: ${props => props.editing ? '22px' : '27px'};
  padding-bottom: 20px;
  color: ${colors.dark2};
  font-size: 13px;
  border-right: 1px solid ${colors.light4};
  background: ${props => props.editing ? '#EAEAEA' : '#fff'};
  min-height: 100%;
  overflow-y: auto;
  text-align: center;

  p {
    line-height: 20px;
    margin: 5px 0;
    opacity: 0.8;
  }

  h3 {
    color: ${colors.dark2};
  }
`

export const SocialList = styled.div`
  margin-top: 12px;

  a {
    margin-right: 20px;
  }
`

export const Stats = styled.div`
  strong {
    margin-right: 6px;
    margin-left: 10px;

    &:first-child {
      margin-left: 0;
    }
  }
`

export const Button = styled.button`
  display: inline-block;
  background-color: transparent;
  color: ${colors.dark2};
  border: 1px solid ${colors.light3};
  font-family: HKGrotesk, sans-serif;
  height: 24px;
  font-size: 11px;
  text-align: center;
  border-radius: 2px;
  margin-right: 17px;
  line-height: 10px;
  padding: 0 15px;
  min-width: 75px;
  vertical-align: text-bottom;
  ${props => props.blue && css`
    color: white;
    background-color: #00B8D5;
    border: 0;
  `}
  ${props => props.blueHollow && css`
    color: #19B7D8;
    border-color: #19B7D8;
  `}
`

export const MetaData = styled.div`
  margin-top: 13px;
`

export const Share = styled.button`
  /* empty */
`

export const Tags = styled.ul`
  list-style-type: none;
  margin: 11px 0 19px;
  padding: 0;
  display: inline-block;

  li {
    height: 23px;
    width: 85px;
    border-radius: 100px;
    border: 1px solid ${colors.blueBright};
    color: ${colors.blueBright};
    text-align: center;
    line-height: 23px;
    display: inline-block;
    margin-right: 10px;

    span {
      color: ${colors.light2};
      font-family: HKGrotesk, sans-serif;
      font-size: 13px;
      font-weight: 500;
      line-height: 16px;
    }
  }
`

export const ContentWrapper = styled.div`
  position: relative;
  overflow: auto;
  flex-grow: 1;

  > div {
    padding-top: 27px;
    padding-left: 48px;
    padding-right: 48px;
    overflow-y: auto;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 100%;
  }
`

export const Title = styled.h3`
  color: #646464;
`

export const SectionTitle = styled.h4`
  font-weight: normal;
  font-size: 16px;
  color: #646464;
  margin-top: 40px;
  margin-bottom: 18px;
`

export const SettingsWrapper = styled.div`
  padding-bottom: 27px;

  input {
    margin-right: 19px;
    vertical-align: text-top;
  }
`

export const PublicationWrapper = styled.div`
  padding-top: 23px;
`
export const Publication = styled.div`
  font-size: 14px;
  font-weight: normal;
  margin-bottom: 73px;

  h3 {
    font-size: 18px;
  }

  p {
    margin-top: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 90%;
    opacity: 0.8;
  }
`

export const PublicationDetails = styled.div`
  color: #646464;
`

export const PublicationComments = styled.span`
  color: ${colors.blueLight};
  display: inline-block;
  padding-left: 22px;
`

export const AddPublicationButton = styled(AddRowButton)`
  button {
    background: #19B7D8;
    font-size: 16px;
    width: 16px;
    height: 16px;
    padding: 0;
    line-height: 13px;
  }

  span {
    color: #19B7D8;
    font-size: 16px;
  }
`
