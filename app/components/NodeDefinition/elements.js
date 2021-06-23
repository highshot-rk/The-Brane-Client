import styled from 'styled-components'

export const DefinitionContainer = styled.div`
  padding-left: 22px;

  p {
    font-size: 10px;
    line-height: 12px;

    /* Some parents change these properties of p */
    display: block !important;
    margin-top: 10px !important;
  }
`

export const DefinitionHeading = styled.p`
  font-weight: bold;
  font-size: 12px;
`
