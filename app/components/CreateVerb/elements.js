import styled from 'styled-components'

export const InputContainer = styled.div`
  border: 1px solid rgba(151, 151, 151, 1);
  border-radius: 0 2px;
  font-family: HKGrotesk, sans-serif;
  display: inline-block;
  padding: 10px;

  input[type='text'] {
    font-family: HKGrotesk, sans-serif;
    font-size: 14px;
    font-weight: 700;
    color: rgba(46, 46, 46, 1);
    min-width: 210px;
    height: auto;
    width: auto;
    padding-left: 10px;

    &::placeholder {
      font-size: 14px;
      font-weight: 500;
      color: rgba(151, 151, 151, 1);
      text-align: left;
    }

    &:focus {
      outline: none;
    }
  }
`

export const SpaciousInput = styled(InputContainer)`
  margin-left: 50px;
`
