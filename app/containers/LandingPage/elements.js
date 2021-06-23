import styled, { css } from 'styled-components'

export const Row = styled.div`
  display: flex;
  align-items: center;
  ${props => props.wrap && css`flex-wrap: wrap;`}
  ${props => props.justify && css`justify-content: ${props.justify};`}
  ${props => props.alignItems && css`align-items: ${props.alignItems};`}
  ${props => props.margin && css`margin: ${props.margin};`}
`

const bg = require('../../styles/01.png')
export const LandingContainer = styled(Row)`
  display: flex;
  align-items: center;
  height: 100vh;
  overflow: hidden;
  background: url('${bg}');
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;

  .a-style {
    font-family: 'IBM Plex Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 165%;
  }

  h5 {
    font-family: Poppins, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 20px;
    line-height: 141.25%;
    color: #FFF;
  }

  h6 {
    font-family: Poppins, sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 141.25%;
    color: #0ED89B;
  }

  @media screen and (max-width: 414px) {
    flex-direction: column;

    .signup-end {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      margin-bottom: 22px;
    }

    .hide-content {
      height: 13%;
    }

    .content-right-height {
      height: 100%;
    }
  }

  @media screen and (max-width: 375px) {
    .signup-end {
      display: flex;
      justify-content: flex-end;
      align-items: flex-end;
      margin-bottom: 22px;
      margin-top: 20px;
    }
  }

  @media screen and (max-width: 320px) {
    .mobile-height {
      height: 100% !important;
    }
  }
`

export const LoginContainer = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: center;
  border-radius: 2px;
  height: 70%;
  width: 100%;

  .h5-login {
    margin-bottom: 0;
  }

  .layout-column {
    display: flex;
    flex-direction: column;
  }

  .layout-column-width {
    display: flex;
    flex-direction: column;
    width: 100%;
  }

  .social-margin {
    margin-top: 14px;
  }

  @media screen and (min-height: 900px) {
    padding-top: 50px;
  }

  @media screen and (max-width: 414px) {
    padding-top: 31px !important;
    padding-left: 1px;
    padding-right: 1px;
    margin: 1px;
    order: 1;
    height: 80%;

    button {
      width: 100%;
    }
  }

  .submitError {
    display: flex;
    align-items: flex-start;
    text-align: left !important;
    margin: 2px 0;
    margin-bottom: 8px;
    color: red;
  }

  /* h1 {
    color: #4D4D4D;
    font-family: HKGrotesk, sans-serif;
    font-size: 26px;
    line-height: 31px;
    text-align: center;
  } */

  h5 {
    margin-bottom: 16px;
  }

  .login-style {
    background-color: transparent;
    color: white;
    border-style: solid;
  }

  .login-error {
    background: #CCC;
    opacity: 0.3;
    border-radius: 999px;
  }

  label {
    color: #646464;

    /* font-family: HKGrotesk, sans-serif; */
    font-size: 14px;
    height: 100%;

    input[type='checkbox'] {
      margin: -3px 12px -3px 0;
    }

    a {
      float: right;
    }
  }

  a {
    color: #19B7D8;
    font-family: 'IBM Plex Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 165%;
    text-decoration: underline;
    cursor: pointer;
  }

  p {
    text-align: center;
    color: #646464;
    font-family: HKGrotesk, sans-serif;
    font-size: 14px;
    margin: 20px 0;

    &.linkedin-details {
      margin-bottom: 12px;
    }
  }

  hr {
    line-height: 1em;
    position: relative;
    outline: 0;
    border: 0;
    color: black;
    text-align: center;
    height: 1.5em;
    opacity: 0.5;

    &::before {
      content: '';
      background: #818078;
      position: absolute;
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
    }

    &::after {
      content: attr(data-content);
      position: relative;
      display: inline-block;
      padding: 0 0.5em;
      line-height: 1.5em;
      color: #818078;
      background-color: #FCFCFA;
    }
  }

  @media screen and (max-width: 768px) {
    padding-top: 150px;
    height: 91%;

    .login-width {
      width: 100%;
      padding-left: 20px;
      padding-right: 20px;
    }

    p {
      font-size: 5px;
    }
  }

  @media screen and (max-width: 414px) {
    padding-top: 98px;
    height: 120%;

    h5 {
      font-size: 18px;
    }

    h6 {
      font-size: 16px;
    }
  }

  @media screen and (max-width: 320px) {
    padding-top: 15px !important;
    margin-right: 2px !important;
  }

  @media screen and (max-width: 320px) {
    height: 120%;

    .login-width {
      width: 100%;
      padding-left: 0.1px;
      padding-right: 0.1px;
    }
  }
`

export const RegistrationContainer = styled(LoginContainer)`
  display: flex;
  height: 100%;
  width: 63.201320132%;
  flex-direction: column;
  justify-content: flex-start;
  align-self: center;
  max-width: 400px;

  .register {
    margin-top: 25px !important;
  }

  .h5-style {
    margin-bottom: 2px;
  }

  .h6-style {
    margin-bottom: 6px;
  }

  .p-margin {
    margin-left: 25px !important;
  }

  .agreement {
    margin: 27px 0 5px 0;
    display: flex;
  }

  .container-top {
    margin-top: 10px;
  }

  .container-bottom {
    margin-bottom: 15px !important;
  }

  .returnLogin {
    margin: 25px 0;
    margin-bottom: 45px;
    display: flex;
    flex-wrap: wrap;
  }

  h1 {
    line-height: 20px;
    margin-bottom: 25px;
    color: white;
  }

  h4 {
    line-height: 20px;
    margin-bottom: 35px;
    color: #0ED89B;
  }

  .checkboxStyle {
    background: #74FFB4;
    border-radius: 2px;
    margin-right: 10px;
  }

  label {
    font-family: 'IBM Plex Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px !important;
    line-height: 165%;
  }

  a {
    font-family: 'IBM Plex Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px !important;
    line-height: 165%;
    color: #74FFB4 !important;
  }

  .container {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    padding-left: 25px;
    margin-bottom: 12px;
    color: white;
    cursor: pointer;
    font-size: 22px;
    user-select: none;

    /* height: 100%; */
    height: 30px;
  }

  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 16px;
    width: 16px;
    background-color: transparent;
    border-radius: 2px;
    border: 1px solid #FFF;
  }

  /* On mouse-over, add a grey background color */
  .container:hover input ~ .checkmark {
    /* background-color: #74FFB4; */
  }

  .container input:checked ~ .checkmark {
    background-color: #74FFB4;
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark::after {
    content: '';
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  .container input:checked ~ .checkmark::after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .container .checkmark::after {
    left: 5px;
    top: 2px;
    width: 6px;
    height: 10px;
    border: solid black;
    border-width: 0 3px 3px 0;

    /* -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg); */
    transform: rotate(45deg);
  }

  @media screen and (min-height: 900px) {
    padding-top: 50px;
    margin-bottom: 80px;
  }

  @media screen and (max-height: 628px) {
    padding-top: 30px;
  }

  @media screen and (max-width: 1024px) {
    width: 83%;

    .register {
      margin-top: 25px !important;
    }

    .container-bottom {
      margin-bottom: 25px !important;
    }
  }

  @media screen and (max-width: 375px) {
    .container-bottom {
      margin-bottom: 45px !important;
    }
  }

  @media screen and (max-width: 320px) {
    width: 100%;
    height: 140%;

    .register {
      margin-top: 25px !important;
    }
  }
`

export const WindowWrapper = styled.div`
  display: flex;
  height: 100%;

  @media screen and (max-width: 320px) {
    padding-left: 17px;
    padding-right: 15px;
  }
`

export const Content = styled.div`
  display: flex;
  justify-content: center;
  color: white;
  width: 100%;
  align-items: center;
  height: 94%;

  .svg-test {
    min-height: 64px;
    min-width: 64px;
  }

  .content-style {
    display: flex;
    flex-direction: column;
    margin-bottom: 50px;
    justify-content: flex-start;
    align-items: center;
  }

  div {
    max-width: 700px;
    width: 100%;
  }

  p {
    position: static;
    width: 279px;
    height: 54px;
    left: 96px;
    top: 9px;
    font-family: 'Frank Ruhl Libre', sans-serif;
    font-style: normal !important;
    font-weight: 200 !important;
    font-size: 24px !important;
    line-height: 1.125em;
    margin-bottom: 20px;
    margin-top: 0;
    color: #CCC;
    padding-top: 12px;
    padding-left: 20px;
  }

  blockquote,
  cite {
    font-style: italic;
    font-size: 20px;
    line-height: 24px;
    display: block;
    margin: 0;
    max-width: 360px;
    text-align: center;
    margin-left: auto;
    margin-right: auto;
  }

  .li {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 30px;
    min-width: 375px;
    width: 50%;
  }

  .p1 {
    position: static;
    width: 350px;
    height: 54px;
    left: 96px;
    top: 9px;
  }

  .p2 {
    position: static;
    width: 200px;
    height: 54px;
    left: 96px;
    top: 9px;
  }

  .p4 {
    position: static;
    width: 300px;
    height: 54px;
    left: 96px;
    top: 9px;
  }

  @media screen and (max-width: 768px) {
    align-items: flex-start;
    padding-top: 120px;

    p {
      font-size: 18px !important;
      margin-bottom: 0.1px;
    }

    .p1 {
      width: 209px;
      padding-left: 0.1px;
      margin-left: 19px;
    }

    .p2 {
      width: 160px;
    }

    .p3 {
      width: 195px;
    }

    .p4 {
      width: 220px;
    }

    .li {
      max-width: 100%;
      margin-left: 50px;
      margin-bottom: 16px;
    }

    .content-style {
      margin-top: -26px;
    }
  }

  @media screen and (max-width: 414px) {
    padding-top: 56px;

    .svg-test {
      width: 32px !important;
    }

    .li {
      margin-bottom: 1px;
      margin-left: 21px;
    }
  }

  @media screen and (max-width: 320px) {
    margin-left: 55px;
    padding-top: 50px;

    .svg-test {
      min-height: 38px;
      min-width: 38px;
    }
  }
`

export const WelcomeContent = styled(Content)`
  min-width: 100%;
  position: absolute;
  bottom: 0;
  flex-direction: column;
`

export const TextButton = styled.div`
  cursor: pointer;
  font-weight: bold;
  font-size: 21px;
  max-width: 700px;
  align-self: flex-end;
  margin: 10px 0 70px 0;
  color: white;
  text-decoration: none;
`

export const SocialBtn = styled.button`
  height: 45px !important;
  min-height: 45px;
  width: 100%;
  border-radius: 999px;
  text-align: center;
  color: #151515;
  font-family: 'IBM Plex Sans', sans-serif !important;
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 100%;
  margin-bottom: 14px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media screen and (max-width: 320px) {
    margin-bottom: 12px;
    min-height: 33px;
    height: 33px !important;
  }

  div {
    flex-grow: 1;
    text-align: center;
  }

  ${({ type }) => {
    switch (type) {
      case 'LIN':
        return `background-color: #0076B7;
          img{
            height: auto;
            width: 20px;
          }
        `
      case 'FB':
        return `background-color: #3B5998;
        img{
            height: 17px;
            width: 17px;
          }
        `
      case 'GO':
        return `border: 1px solid #848484;         
         background-color: #FFFFFF;
         color: #4D4D4D;
         img{
          height: 19px;
          width: 18px;
          }
        `
      default:
        return `background-color: #74FFB4;
        img{
            height: auto;
            width: 20px;
          }
        `
    }
  }
}
`

export const IconInput = styled.input`
  height: 50px;
  width: 100%;
  border: 1px solid ${({ valid }) => valid ? '#999999' : 'red'};
  border-radius: 2px;
  background-color: #FFF;
  padding: 0 20px;
  margin-bottom: 10px;
  background-image: url(${({ icon }) => icon}) no-repeat;
  background-size: 20px;
  background-repeat: no-repeat;
  background-position: 95% center;

  &:focus {
    outline: none;
  }
`

export const ActivateAcountContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 2px;
  height: 100%;
  width: 100%;

  .computer-svg {
    display: flex;
    align-content: center;
    width: 100%;
    margin-bottom: 20px;
  }

  h1 {
    color: #4D4D4D;
    font-size: 26px;
    line-height: 31px;
    text-align: center;
    font-family: HKGrotesk, sans-serif;
    margin-top: 26px;
    margin-bottom: 46px;
  }

  h5 {
    margin-bottom: 2px;
  }

  .btn-style {
    margin-top: 24px;
    margin-bottom: 24px;
  }

  .login-style {
    margin-top: 24px;
    margin-bottom: 24px;
    background-color: transparent;
    color: white;
    border-style: solid;
  }

  p {
    margin: 0;
    font-family: 'IBM Plex Sans', sans-serif !important;
    font-style: normal !important;
    font-weight: normal !important;
    font-size: 12px !important;
    line-height: 165% !important;
  }

  .p-style {
    margin-bottom: 5px;
    text-align: inherit;
  }

  .p-style2 {
    font-family: 'Frank Ruhl Libre', sans-serif !important;
    font-weight: 300 !important;
    font-size: 22px !important;
    line-height: 125% !important;
    margin-bottom: 5px;
    text-align: inherit;
  }

  a {
    font-family: 'IBM Plex Sans', sans-serif !important;
    font-style: normal !important;
    font-weight: normal !important;
    font-size: 12px !important;
    line-height: 165% !important;
    text-decoration-line: underline;
    color: #74FFB4;

    &.button {
      line-height: 18px;
      cursor: pointer;
      margin-top: 38px;
      text-align: center;
      display: block;
    }
  }

  .a-colour {
    color: #0ED89B;
  }

  .continue {
    text-decoration: none;
  }

  @media screen and (max-width: 768px) {
    justify-content: flex-start;
    padding-top: 184px;
  }

  @media screen and (max-width: 414px) {
    justify-content: flex-start;
    padding-top: 31px;
    padding-left: 21px;
    padding-right: 21px;

    .verify-style {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .error-style {
      width: 100%;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      overflow-y: auto;
    }

    p {
      text-align: left !important;
    }
  }
`

export const Resend = styled.div`
  color: #19B7D8;
`

export const FormContainer = styled.div`
  max-width: 400px;
  margin: 0 auto;

  .inputWrapper {
    margin: 10px 0;
    flex: 1;
  }

  .uploadFile {
    margin-top: 6px;
    cursor: pointer;
  }
`

export const Logo = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  height: 12%;
  width: 100%;
  color: white;
  padding-left: 21px;
  padding-top: 20px;

  .logoTitle {
    font-size: 30px;
    font-weight: 300;
    margin: 4px;
    bottom: 0;
    padding-left: 1px;
    padding-top: 20px;
  }

  @media screen and (max-width: 414px) {
    z-index: 1;

    .logo-svg {
      width: 160px;
      height: 40px;
    }
  }

  @media screen and (max-width: 375px) {
    z-index: 1;

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

export const SignUp = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: flex-start;
  padding-right: 28px;
  height: 30%;
  padding-top: 30px;

  p {
    margin: 0 !important;
    font-family: 'IBM Plex Sans', sans-serif !important;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
  }

  .linkText {
    margin: 0 !important;
    font-family: 'IBM Plex Sans', sans-serif !important;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    color: #74FFB4;
  }

  @media screen and (max-width: 768px) {
    height: 9%;
  }

  @media screen and (max-width: 414px) {
    height: 20%;
    width: 100%;
    order: 2;
    padding-right: 20px;
    margin-bottom: 20px;

    p {
      font-size: 12px !important;
    }

    .linkText {
      font-size: 12px;
    }
  }

  @media screen and (max-width: 375px) {
    padding-top: 5px;
  }

  @media screen and (max-width: 320px) {
    padding-top: 8px;
  }
`

export const ContentLeft = styled.div`
  width: 55%;
  height: 100%;
  background-color: rgb(21, 21, 21, 0.84);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  p {
    font-size: 20px;
  }

  @media screen and (max-width: 414px) {
    width: 100%;
    height: 54%;

    p {
      font-size: 16px !important;
    }

    .hide-content {
      display: none;
    }

    .logo-height {
      height: 100%;
    }
  }
`

export const ContentRight = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 45%;
  overflow: auto;
  background-color: rgb(35, 35, 35, 0.84);

  a {
    color: #19B7D8;
    font-family: HKGrotesk, sans-serif;
    font-size: 14px;
    line-height: 18px;
    text-decoration: underline;
    cursor: pointer;
  }

  p {
    text-align: center;
    color: #FFF;
    font-family: HKGrotesk, sans-serif;
    font-size: 14px;
    margin: 20px 0;

    &.linkedin-details {
      margin-bottom: 12px;
    }
  }

  label {
    font-family: 'IBM Plex Sans', sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 165%;
  }

  .login-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }

  @media screen and (max-width: 768px) {
    width: 55%;
  }

  @media screen and (max-width: 414px) {
    height: 47%;
    width: 100%;
    overflow-x: hidden;
  }

  @media screen and (max-width: 320px) {
    height: 47%;
    width: 100%;

    br {
      display: none;
    }
  }
`
