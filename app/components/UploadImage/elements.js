import styled, { css } from 'styled-components'

export const AddImg = styled.div`
  > div {
    min-height: 85px;
    width: 100%;
    border: ${props => props.preview ? 'solid' : 'dashed'} 1px #979797;
    margin: 0 auto;
    margin-top: 20px;
    cursor: pointer;
    display: flex;
    align-items: flex-end;
    justify-content: ${props => props.preview ? 'flex-end' : 'center'};
    padding: 3px;
    ${props => props.preview &&
    css`background: url('${props => props.preview}');
    height: 204px;
    max-width: 560px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;`
}
  }

  img {
    max-height: 78px;
  }

  .remove {
    ${props => props.preview ? css`display: block;` : css`display: none;`}
    align-self: flex-start;
    border-radius: 50%;
    background-color: #9B9B9B;
    color: white;
    width: 13px;
    height: 13px;
    font-size: 12px;
    text-align: center;
    line-height: 14px;
    margin-right: -10px;
    margin-top: -4px;
    cursor: pointer;
  }

  .placeholder {
    ${props => props.preview && css`display: none;`}
    width: 100%;
    height: 100%;
    text-align: center;
    color: #979797;
    align-self: center;

    p {
      margin: 0;
    }

    .browse {
      text-decoration: underline;
    }
  }
`
