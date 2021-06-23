import { TagInput } from '../TagSelector/elements'
import styled from 'styled-components'
import { Window, WindowWrapper } from 'elements/window'

export const SelectType = styled(TagInput)`
  .Select--single > .Select-control .Select-value {
    cursor: pointer;
    line-height: 50px;
  }

  .Select-value-label {
    font-size: 15px;
  }

  .Select-placeholder {
    color: #444;
    font-size: 15px;
  }
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

export const PublicationWrapper = styled(WindowWrapper)`
  margin: 0 auto;
  width: auto;
  z-index: 10;

  ${Window} {
    min-height: 50%;
    width: 500px;
  }
`
