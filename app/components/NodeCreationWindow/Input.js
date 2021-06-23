import React from 'react'
import styled from 'styled-components'

const InputWrapper = styled.div`
  display: flex;
  padding: 16px 20px;
  border: 1px solid #979797;
  flex-grow: 1;

  & + & {
    margin-top: 10px;
  }
`

const Label = styled.span`
  font-family: HKGrotesk, sans-serif;
  font-size: 14px;
  font-weight: 400;
  color: #646464;
  margin-right: 10px;
`

const Input = styled.input`
  flex: 1;
  font-family: HKGrotesk, sans-serif;
  font-size: 14px;
  font-weight: 700;
  outline: none;
  border: none;

  ::placeholder {
    font-weight: 400;
    color: #979797;
  }
`

const TextInput = ({ label, rightComponent, ...inputProps }) => (
  <InputWrapper>
    {label && <Label> {label}: </Label>}
    <Input {...inputProps} />
    {rightComponent && rightComponent()}
  </InputWrapper>
)

export default TextInput
