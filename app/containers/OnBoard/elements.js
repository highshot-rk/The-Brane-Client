import styled, { css, keyframes } from 'styled-components'
import { TagInput } from 'components/TagSelector/elements'
import {
  Head,
} from 'components/Accordion/elements'
import { InputWrapper } from 'elements/form'

export const Row = styled.div`
  display: flex;
  align-items: center;
  ${props => props.wrap && css`flex-wrap: wrap;`}
  ${props => props.justify && css`justify-content: ${props.justify};`}
  ${props => props.alignItems && css`align-items: ${props.alignItems};`}
  ${props => props.margin && css`margin: ${props.margin};`}
`
const bg = require('../../styles/03.jpg')
export const QuestionsContainer = styled(Row)`
  display: flex;
  align-items: center;
  height: 100vh;
  overflow: auto;
  background: url('${bg}');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  h5 {
    color: #0ED89B;
    font-family: Poppins, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 141.25%;
    margin-top: 4px;
  }

  h6 {
    font-family: Poppins, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 141.25%;
    color: #CCC;
  }

  a {
    color: #808080;
    font-family: 'IBM Plex Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    padding-right: 19px;
    cursor: pointer !important;
  }

  .question-error {
    color: red;
    margin-left: 0.5px;
  }

  p {
    font-family: 'IBM Plex Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 165%;
  }

  .title {
    font-family: 'Frank Ruhl Libre', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 42px;
    line-height: 112.5%;
    color: #FFF;
    margin: 0.1px;
    margin-bottom: 16px;
    margin-top: 8px;
  }

  .input-label {
    font-family: 'IBM Plex Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 165%;
    color: #CCC;
    margin: 0.1px;
  }

  @media screen and (max-width: 1024px) {
    flex-direction: column;
  }

  @media screen and (max-width: 320px) {
    .title {
      font-family: 'Frank Ruhl Libre', sans-serif;
      font-style: normal;
      font-weight: 300;
      font-size: 22px !important;
      line-height: 112.5%;
      color: #FFF;
      margin: 0.1px;
      margin-bottom: 16px;
      margin-top: 8px;
    }
  }

  @media screen and (max-width: 733px) {
    .title {
      font-family: 'Frank Ruhl Libre', sans-serif;
      font-style: normal;
      font-weight: 300;
      font-size: 22px !important;
      line-height: 112.5%;
      color: #FFF;
      margin: 0.1px;
      margin-bottom: 16px;
      margin-top: 8px;
    }
  }
`

export const LogoContainer = styled.div`
  display: flex;
  height: 100%;
  width: 19.444444444%;
  align-items: flex-start;
  justify-content: flex-start;
  padding-left: 20px;
  padding-top: 20px;

  @media screen and (max-width: 1024px) {
    width: 100%;
    height: 12%;
  }

  @media screen and (max-width: 414px) {
    .logo-svg {
      width: 160px;
      height: 40px;
    }
  }

  @media screen and (max-width: 320px) {
    .logo-svg {
      width: 128px;
      height: 32px;
    }
  }
`
export const ContentContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: flex-start;

  .h5-style {
    margin-right: 10px;
  }

  .input-style {
    display: flex;
    flex-direction: column;
  }

  .input-wrapper {
    margin-left: 0;
    width: 100%;
  }

  .input-wrapper-margin {
    margin-left: 0;
    width: 100%;
    margin-bottom: 12px;
  }

  .btn-submit {
    margin: 0;
    height: 45px;
    width: 103px;
    border-radius: 999px;
    background-color: #74FFB4;
    color: black;
  }

  .submit-btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 64px;
  }

  hr.style {
    border: 1px solid #808080;
  }

  .h6-hover {
    display: inline-block;
    cursor: pointer !important;
  }

  .start-btn {
    margin: 0.1px;
    height: 45px;
    width: 103px;
    border-radius: 999px;
    background-color: #74FFB4;
    color: black;
  }

  .question-7 {
    padding-top: 110px;
  }

  .project-skip-btn {
    display: flex;
    align-items: flex-end;
    flex-direction: column;
  }

  .project-skip-row {
    display: flex;
    align-items: center;
    flex-direction: row;
  }

  .welcome-style {
    padding-top: 162px;
    width: 48%;
    min-width: 578px;
    max-width: 578px;
  }

  .thanks {
    padding-top: 162px;
    width: 994px;
    max-width: 1000px;
  }

  .thanks-submit {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 64px;
  }

  .thanks-btn {
    margin: 0;
    height: 45px;
    width: 243px;
    border-radius: 999px;
    background-color: #74FFB4;
    color: black;
  }

  .pad-b {
    padding-top: 110px;
    width: 45%;
  }

  .question-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  .mission-style {
    padding-top: 110px;
    width: 85.689655172%;
    max-width: 984px;
    justify-self: center;
  }

  .mission-content {
    display: flex;
    align-items: center;
    height: 100%;
  }

  .link-style {
    text-decoration: none;
  }

  .test {
    font-family: 'Frank Ruhl Libre', sans-serif !important;
    font-style: normal;
    font-weight: 300;
    font-size: 28px;
    line-height: 142.5%;
    color: #FFF;
  }

  .form-btn {
    display: flex;
    justify-content: flex-end;
  }

  .btn-welcome {
    border-radius: 999px;
    background-color: #74FFB4;
    color: black;
    margin-top: 0.1px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 100%;
    width: 284px;
    height: 45px;
  }

  .btn-style {
    margin: 0.1px;
    height: 45px;
    width: 284px;
    border-radius: 999px;
    background-color: #74FFB4;
    color: black;
    z-index: 1;
  }

  .project-input-1 {
    display: flex;
    flex-direction: column;
    margin-bottom: 0;
  }

  .project-input-2 {
    display: flex;
    flex-direction: column;
    margin-bottom: 12px;
  }

  .project-input-3 {
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
  }

  .project-remove {
    display: flex;
    justify-content: flex-end;
  }

  .a-remove {
    padding-right: 0;
  }

  @media screen and (max-width: 1024px) {
    .welcome-style {
      width: 100%;
      min-width: 100%;
      max-width: 100%;
      padding-top: 77.77px;
      padding-left: 20px;
    }

    .welcome-title {
      width: 60%;
    }

    .start-btn {
      margin-right: 20px;
    }

    .mission-style {
      padding-top: 25.77px;
      padding-left: 20px;
      width: 100%;
      justify-self: center;
    }

    .form-btn {
      margin-top: 72px;
    }

    .question-7 {
      padding-top: 25.77px;
    }

    .thanks {
      padding-top: 50.77px;
      width: 100%;
      max-width: 100%;
      padding-left: 72px;
      padding-right: 72px;
    }
  }

  @media screen and (max-width: 733px) {
    width: 100%;
    height: 83%;
    padding-left: 22px;
    padding-right: 22px;

    .pad-b {
      padding-top: 0.1px;
      width: 100%;
    }

    .test {
      font-family: 'Frank Ruhl Libre', sans-serif !important;
      font-style: normal;
      font-weight: 300;
      font-size: 16px;
      line-height: 142.5%;
      width: 100%;
      color: #FFF;
    }

    .btn-style {
      margin: 0.1px;
      margin-top: 24px;
      height: 45px;
      width: 284px;
      border-radius: 999px;
      background-color: #74FFB4;
      color: black;
    }

    .form-btn {
      width: 100%;
    }
  }

  @media screen and (max-width: 414px) {
    padding-left: 15px;
    padding-right: 15px;
    height: 88%;

    .welcome-style {
      padding-top: 0.1px;
      padding-left: 0.1px;
    }

    .question-7 {
      min-height: 80vh;
      overflow: auto;
    }

    .welcome-title {
      width: 95%;
    }

    .start-btn {
      margin-right: 0.1px;
    }

    .mission-style {
      padding-top: 0.1px;
      padding-left: 0.1px;
      width: 100%;
      justify-self: center;
    }

    .form-btn {
      margin-top: 40px;
    }

    .thanks {
      padding-top: 0.1px;
      padding-left: 0.1px;
      padding-right: 0.1px;
    }
  }

  @media screen and (max-width: 320px) {
    .test {
      font-size: 12px;
    }
  }
`
export const FinishContainer = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  align-items: flex-end;
  justify-content: flex-end;
  padding-right: 30px;
  position: relative;

  .finish-later {
    font-family: 'IBM Plex Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    color: #808080;
    margin-bottom: 30px;
    bottom: 0.1px;
  }

  @media screen and (max-width: 733px) {
    .finish-later {
      font-family: 'IBM Plex Sans', sans-serif;
      font-style: normal;
      font-weight: normal;
      font-size: 14px;
      line-height: 150%;
      color: #808080;
      margin-bottom: 22px;
    }
  }

  @media screen and (max-width: 414px) {
    padding-right: 0.1px;

    a {
      padding-right: 0.1px;
    }
  }
`

export const FormContainer = styled.div`
  min-width: 100%;
  min-height: 100%;
  padding: 0 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: max-content;
`

export const NodeContainer = styled.div`
  display: flex;
  flex-grow: 1;
  justify-content: center;
  align-items: center;
`

const hideOrbit = keyframes`
  0% {
    transform: scale(1, 1);
    opacity: 1;
  }

  100% {
    transform: scale(0.75, 0.75);
    opacity: 0;
  }
`

export const SVGContainer = styled.svg`
  .node__single-node-view-icon,
  .add-btn {
    display: none;
  }

  transition: ${props => props.centered ? '1.5s' : '2s'} transform;
  transform:
    ${props =>
    props.centered
      ? 'translate(-25vw, 0)'
      : props.collapsed
        ? `translate(${props.collapsedPosition.x}px, ${props.collapsedPosition.y}px)`
        : ''
};
  ${props => props.collapsed && props.hasChildren && css`
  .node__orbit--hidden, .node__orbit circle {
    transition: 2s opacity, 2s transform !important;
    animation: ${hideOrbit} 2s;
  }`
}
  ${props => props.collapsed && css`
  .node .node__center-node circle, .node__related-node  {
    transition: 2s transform;
  }
  `}
`

export const ProfileInputWrapper = styled(InputWrapper)`
  display: flex;
  flex-direction: column;
  padding: 12px;
  width: 50%;
  height: 45px;
  left: 0.1px;
  top: 22px;
  background-color: #FFF;

  input {
    background-color: white;
    width: 100%;
    align-self: baseline;
    font-family: 'IBM Plex Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    color: #333 !important;

    &::placeholder {
      opacity: 1;
    }
  }
`
export const WindowWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-self: center;
  width: 75%;

  .previous {
    font-family: 'IBM Plex Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    line-height: 150%;
    margin: 0.1px;
    margin-bottom: 4px;
    color: #808080;
  }

  .title {
    font-family: 'Frank Ruhl Libre', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 42px;
    line-height: 112.5%;
    margin-top: 8px;
    margin-bottom: 16px;
    color: #FFF;
  }

  div {
    width: 100%;
  }

  h5 {
    color: #0ED89B;
  }

  button {
    border-radius: 999px;
    background-color: #74FFB4;
    color: black;
    margin-top: 0.1px;
    font-family: 'IBM Plex Sans', sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 16px;
    line-height: 100%;
    width: 284px;
    height: 45px;
  }

  p {
    color: #CCC;
    font-family: 'Frank Ruhl Libre', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 28px;
    line-height: 142.5%;
  }

  label {
    color: #CCC;
  }
`
export const WindowHeader = styled.h1`
  margin-top: 45px;
  height: 31px;
  width: 258px;
  color: #4D4D4D;
  font-family: HKGrotesk, sans-serif;
  font-size: 26px;
  line-height: 31px;
  text-align: left;
`

export const Instructions = styled.p`
  color: #4D4D4D;
  font-size: 15px;
  line-height: 19px;
  margin-top: 38px;
  margin-bottom: 46px;
`

export const SelectWrapper = styled(TagInput)`
  margin-bottom: 15px;
`

export const Selectors = styled.div`
  ${TagInput} {
    margin-bottom: 15px;
  }

  .Select-control {
    margin-left: 0;
    border-radius: 2px;
    padding-left: 15px;
  }

  .Select-value-label {
    font-size: 15px;
  }

  .Select-placeholder {
    color: #7C7C7C;
    font-size: 14px;
    margin-left: 15px;
  }

  .Select-control:hover {
    box-shadow: none;
  }

  .is-open {
    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);

    .Select-control {
      display: relative;

      /* Show above menu so it's shadow doesn't show on select-control */
      z-index: 10;
    }

    .Select-menu-outer {
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
    }
  }

  ${Head/* sc-selector */},
  .Select-option {
    padding: 12px 20px;
    font-size: 14px;

    &.is-focused {
      background: #F7F7F7;
    }
  }
`

export const DismissButton = styled.p`
  text-align: center;
  cursor: pointer;
  color: #646464;
`

export const Error = styled.p`
  color: red;
  margin: 5px;
  text-align: center;
`

export const AddImg = styled.div`
  > div {
    min-height: 85px;
    width: 100%;
    margin: 0 auto;
    margin-top: 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 3px;
    ${props => props.preview &&
    css`background: url(${props => props.preview});
    height: 204px;
    max-width: 560px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    `}

    margin-bottom: 50px;
  }

  .image-wrapper {
    width: 90px;
    height: 90px;
    position: relative;
    overflow: hidden;
    border-radius: 50%;

    /* Needed so it is behind .add */
    z-index: -1;
  }

  img {
    display: block;
    margin: 0 auto;
    height: 100%;
    width: auto;
  }

  .add {
    align-self: flex-end;
    border-radius: 50%;
    background-color: #000;
    color: white;
    width: 30px;
    height: 30px;
    font-size: 40px;
    line-height: 26px;
    border: 2px solid #979797;
    text-align: center;
    margin-left: -29px;
    margin-bottom: 5px;
    cursor: pointer;
    font-weight: 300;
  }

  p {
    margin-left: 25px;
    font-size: 17px;
    color: #878787;
  }
`

export const WelcomeWrapper = styled.div`
  display: flex;
  height: 100%;
  min-height: 100vh;
  width: 100%;
  min-width: 100%;

  p {
    font-family: 'Frank Ruhl Libre', sans-serif;
    font-style: normal;
    font-weight: 300;
    font-size: 28px;
    line-height: 142.5%;
    color: #FFF;
    flex: none;
    order: 1;
  }

  .form-btn {
    position: absolute;
    justify-content: flex-end;
    width: 994px;
    height: 45px;
    top: 484px;
    bottom: 0.1px;
    flex: none;
    order: 1;
    display: flex;
    align-self: flex-end;
  }

  button {
    width: 284px;
    height: 45px;
    right: 0.1px;
    top: calc(50% - 45px / 2);

    /* Colours / Accent / Green / Regular */

    background: #74FFB4;
    border-radius: 999px;
  }
`
