import styled, { css } from 'styled-components'

export const InputRow = styled.div`
  display: flex;
  margin-bottom: ${props => props.marginBottom || '20px'};
  ${props => props.direction === 'vertical' ? css`flex-direction: column;` : ''}

  > * {
    flex: 1;
  }

  > *:not(:first-child) {
    ${({ direction }) => direction !== 'vertical' ? css`margin-left: 20px;` : ''}
  }
`

export const InputWrapper = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  border: 1px solid ${props => props.error ? 'red' : 'rgba(151, 151, 151, 1)'};
  border-radius: 0 2px;
  font-family: HKGrotesk, sans-serif;
  height: ${props => props.height || '50px'};
  padding: 10px;
  flex-wrap: wrap;

  &::after {
    position: absolute;
    top: 58px;
    left: 0;
    content: '${props => props.error}';
    display: ${props => props.error ? 'block' : 'none'};
    color: red;
    font-size: 14px;
  }

  label {
    display: flex;
    align-items: center;
    flex-grow: 0;
    font-size: 14px;
    color: rgba(100, 100, 100, 1);
    height: auto;
  }

  span {
    cursor: pointer;
  }

  input,
  textarea {
    display: flex;
    align-items: center;
    flex-grow: 1;
    font-family: HKGrotesk, sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: rgba(46, 46, 46, 1);
    height: auto;

    &::placeholder {
      font-size: 14px;
      font-weight: 500;
      color: #7C7C7C;
      text-align: left;
    }

    &:focus {
      outline: none;
    }
  }

  textarea {
    width: 100%;
    height: 100px;
  }

  input[type='date']:not(.has-value) {
    text-align: right;
    color: #BFBFBF;
  }

  input[type='date']:not(.has-value)::before {
    font-size: 14px;
    font-weight: 500;
    color: #BFBFBF;
    text-align: left;
    margin-right: 0.5em;
    content: attr(placeholder);
  }
`

export const SectionTitle = styled.h3`
  color: #4D4D4D;
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 20px;
  line-height: 14px;
`

export const MiniCheckbox = styled.input`
  && {
    height: 9px;
    width: 9px;
    border-radius: 1px;

    &:checked::after {
      content: '';
      position: absolute;
      width: 6px;
      height: 4px;
      background: transparent;
      top: 1px;
      left: 1px;
      border: 1px solid #000;
      border-top: none;
      border-right: none;
      transform: rotate(-52deg);
    }
  }
`

export const Submit = styled.button`
  height: 55px;
  width: 366px;
  background-color: ${props => props.showAsDisabled ? '#ddd' : '#8662DF'};
  border-radius: 2px;
  margin: 20px auto 0 auto;
  color: #FFF;
  font-family: HKGrotesk, sans-serif;
  font-size: 14px;
  display: block;

  &:disabled {
    background: #DDD;
  }

  &:focus {
    outline: none;
  }
`

export const Cancel = styled.button`
  background-color: transparent;
  color: #E84F4F;
`

export const FormActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;

  ${Submit} {
    display: inline-block;
    margin: 0;
  }

  ${Cancel} {
    margin-right: 50px;
  }
`

export const AddRowButton = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${props => props.condensed ? '0' : '20px'};
  margin-bottom: ${props => props.condensed ? '10px' : '0'};
  cursor: pointer;

  button {
    font-family: HKGrotesk, sans-serif;
    font-size: 13px;
    line-height: 14px;
    color: white;
    background: ${props => props.gray ? '#9B9B9B' : '#83c686'};
    border-radius: 50%;
    width: 15px;
    height: 14px;
    padding: 0 0 0 1px;
    ${props => props.condensed ? css`transform: scale(0.8);` : ''}

    &:focus {
      /* Overwriting the user agent default focus outline */
      outline: none;
    }
  }

  img {
    width: 15px;
  }

  span {
    padding-left: 10px;
    color: #979797;
    font-size: ${props => props.condensed ? '11px' : '14px'};
  }
`

export const CheckedRowButton = styled(AddRowButton)`
  button {
    background-color: #00B6D5;
  }
`

export const RemoveRowButton = styled(AddRowButton)`
  button {
    background: #E84F4F;
  }
`

export const HiddenLink = styled.p`
  cursor: pointer;
  ${props => props.spacious && css`margin: 25px 0;`}

  &:hover {
    color: #59A1D3;
  }
`

export const LargeButton = styled.button`
  min-width: ${props => props.buttonStyle === 'transparent' ? '0' : '82px'};
  border-radius: 2px;
  background-color: ${props => props.background};
  color: ${props => props.color || '#fff'};
  font-size: 12px;
  line-height: 18px;
  text-align: center;
  height: auto;
  padding: 9px ${props => props.transparent ? '7px' : '32px'};
  float: right;
  margin-left: 12px;
  outline: none;
  font-weight: bold;

  &:hover {
    opacity: 0.9;
  }
`

// TODO: the sizing should be more generalized
export const ErrorMessage = styled.p`
  color: red;
  padding: 10px 0;
  font-size: 14px;
  margin: 0;
  width: 100%;
`
