import styled from 'styled-components'

export const NodeIcon = styled.img`
  width: 20px;
  height: 20px;
  margin-right: 9px;
`

export const VennIcon = styled.img`
  width: 40px;
  height: 36px;
  margin-right: 9px;
`

export const Title = styled.h1`
  font-family: HKGrotesk-Regular, sans-serif;
  font-weight: 300;
  margin: 0;
  margin-bottom: 16px;
  line-height: 1;
  font-size: 25px;
  display: flex;
  align-items: center;
`

export const Definition = styled.p`
  font-weight: 300;
  text-align: justify;
  max-height: ${props => props.showAll ? 'auto' : '98px'};
  overflow: hidden;
  position: relative;

  &::after {
    display: ${props => props.showAll ? 'none' : 'block'};
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 20px;
    background: #FFF;
    opacity: 0.5;
  }
`

export const Tag = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;

  span {
    padding-top: 4px;
    padding-left: 7px;
    font-size: 12px;
    line-height: 12px;
  }
`

export const MoreButton = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-top: 15px;
`

export const EditButton = styled.div`
  font-size: 12px;
  cursor: pointer;
  margin-right: 20px;
  padding-top: 3px;
`
export const FollowButton = styled.div`
  width: 80px;
  margin: ${props => props.longDescription ? '-2px' : '10px'} 29px -5px auto;
  background-color: #2E2E2E;
  color: white;
  font-size: 13px;
  padding: 4px 0;
  text-align: center;
  border-radius: 3px;

  &:hover {
    opacity: 0.95;
  }
`

export const Expand = styled.div`
  cursor: pointer;
  height: 24px;
  margin: 0 20px;

  &:hover {
    background: #F5F5F5;
  }

  hr {
    margin-top: 0;
    margin-bottom: 1px;
    border-width: 1px 0 0 0;
  }

  img {
    position: relative;
    display: block;
    margin-left: calc(50% - 9px);
    transform: rotate(90deg);
    margin-top: 3px;
    opacity: 0.5;
  }
`

export const Tags = styled.div`
  flex-grow: 1;
  display: flex;
`

export const AddPublication = styled.div`
  padding: 20px 30px;
  background: #F5F5F5;
  cursor: pointer;
  display: flex;
  box-shadow: 0 2px 4px rgba(149, 149, 149, 0.5);

  img {
    flex: auto;
    max-width: 20px;
    align-self: center;
  }

  span {
    padding-left: 25px;
    align-self: center;
    color: #444;
    font-size: 17px;
    font-weight: 100;
  }
`

export const SaveButton = styled.span`
  color: #1EB9D9;
  text-decoration: underline;
  cursor: pointer;
  display: inline-block;
  margin-left: 2px;
  ${(props) => (props.saveImage && `
  color:white;
  background:#1EB9D9;
  text-decoration: none;
  padding: 5px;
  border-radius: 4px;
  position: absolute;
  right: 5px;
  top: 5px;
  margin: 0;
  `)}
  ${(props) => (props.save && `
  color:white;
  background:#1EB9D9;
  float:left;
  text-decoration: none;
  padding: 5px;
  border-radius: 4px;
  position: absolute;
  margin-left: 28px;
  left: 0;
  bottom: 0;
  `)
}
`

export const EditTextArea = styled.textarea`
  width: 100%;
  height: auto;
  font-size: 14px;
  font-weight: 300;
  color: #2D2D2D;
  line-height: 18px;
  margin: 0;
  padding-top: 0.4rem;
  padding-bottom: 0.4rem;
  font-family: HKGrotesk, sans-serif;
`

export const Publication = styled.div`
  padding: 20px 27px;
  border-bottom: 1px solid #D7D7D7;
  color: #959595;
  display: flex;
  flex-direction: row;

  a {
    color: #444;
  }

  section {
    flex: 2;

    p {
      text-align: left;

      strong {
        font-weight: 600;
        color: #747272;
      }

      button {
        color: #1EB9D9;
        cursor: pointer;
        display: contents;
      }
    }
  }

  .node-preview-window__confidence-container {
    top: unset;
    position: relative;
    transform: unset;
    color: #444;
    left: unset;
    flex: 0.6;

    p {
      text-align: left;
    }
  }
`

export const EditPost = styled.div`
  .edit-post-container {
    top: 25px;
    position: relative;
    transform: unset;
    color: #444;
    left: unset;
    flex: 0.2;
  }

  padding: 15px 27px;
  border-bottom: 1px solid #D7D7D7;
  color: #959595;
  display: flex;
  flex-direction: row;

  h5 {
    color: #444;
  }

  section {
    flex: 2;

    p {
      text-align: left;
      margin: 0;

      strong {
        font-weight: 600;
        color: #1EB9D9;
        text-decoration: underline;
      }
    }

    a {
      margin: 10px 0;
      cursor: pointer;
      position: absolute;
    }
  }
`

export const AuthorCard = styled.div`
  display: flex;
  color: #959595;
  float: right;

  img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  section {
    padding-left: 8px;
    margin-top: 0;

    p {
      font-size: 10px;
      margin: 0;
      display: contents;

      img {
        width: unset;
        height: unset;
      }
    }

    span {
      font-size: 12px;
      margin: 0;
      display: block;

      strong {
        color: #1EB9D9;
      }
    }

    p + span + p,
    p + span + p + p,
    p + span + p + p + p {
      display: inline-block;
      font-size: 12px;
    }
  }
`

export const AddPublicationModal = styled.div`
  article {
    position: absolute;
    z-index: 200;
    top: 0;
    height: 100%;
    background: #2525254F;
    width: 560px;
  }

  section {
    background: white;
    z-index: 300;
    margin-top: 30%;
    padding-bottom: 3px;
    position: absolute;
    top: 0;
    width: 560px;

    span {
      display: block;
      background: #F2F2F2;
      margin: 0;
      padding: 8px 31px;
      width: 100%;
      color: #444;
    }

    input[type='text'] {
      border: 1px solid #6A6A6A;
      padding: 7px 6px;
      font-size: 16px;
      height: auto;
      width: 260px;
      margin: 15px 31px;
    }

    button {
      background: #6A6A6A;
      color: #FFF;
      margin: 11px auto;
      display: block;
      font-size: 13px;
      border-radius: 2px;
      font-weight: 100;
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
`

export const SearchContainer = styled.div`
  background: #D1D1D1;
  position: relative;
  flex-grow: 1;

  input {
    width: 100%;
  }
`

export const LinkSidebarContainer = styled.div`
  background: white;
  height: auto;
  width: 350px;
  z-index: 1;
  position: relative;
  top: ${({ top }) => top};
  display: block;

  .header {
    padding: 15px;
    width: 100%;
    display: flex;

    .info {
      flex: 1;
      display: flex;

      a {
        cursor: pointer;
        text-decoration: underline;
      }
    }

    &:hover {
      .explore {
        opacity: 1;
      }
    }
  }

  .explore {
    float: right;
    margin-right: 10px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }

  .section {
    display: flex;
  }

  ul {
    overflow-y: auto;
    height: auto;
    max-height: 350px;
    max-width: 350px;
    margin: 0;
    padding: 0;
    background: white;

    li {
      list-style-type: none;

      img {
        margin-top: -4px;
      }

      h5 {
        display: inline-block;
        font-size: 12px;
        color: #444;
        margin-left: 8px;
        word-wrap: break-word;
        max-width: 220px;
        line-height: 1;
        white-space: normal;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      p {
        width: auto;
        font-size: 12px;
      }

      h4 {
        font-size: 12px;
        color: black;
      }

      .edit-post-container {
        top: 0;
        left: -14px;
      }
    }
  }
`

export const LinkDetail = styled.section`
  strong {
    color: #3EE0A4;
    font-size: 11px;
  }

  background: rgba(225, 225, 225, 0.5);
  overflow: hidden;
  width: 100%;
  transition: max-height 0.5s ease-in-out 0s, opacity 0.1s ease-out 0.5s, padding linear 0.1s 0s;
  padding: ${props => props.display ? '0px' : '15px'} !important;
  transition-delay: ${props => props.display && '0.2s,0s,0.2s'};
  display: ${props => props.display && 'block !important'};
  max-height: ${props => props.display ? '0px' : '500px'};
  opacity: ${props => props.display ? 0 : 1};
`

export const Actions = styled.div`
  background: #D1D1D1;
  z-index: 1;
  padding-top: 5px;

  button {
    margin-left: 10px;
  }
`

export const LinkNavHeader = styled.div`
  position: relative;
  width: 100%;
  box-shadow: 0 -7px 7px 3px black;
  height: 50px;
  background: white;
  z-index: 1;
  display: flex;
  align-items: center;

  div {
    display: flex;
    align-items: center;
    flex: 1;
    margin-left: 10px;

    img {
      height: 20px;
      cursor: pointer;
      margin: 0 5px;
    }

    button {
      font-size: 12px;
      font-weight: bold;
      text-align: left;

      &:focus {
        outline: unset;
      }
    }
  }

  .n-forward {
    button {
      margin: 0 0 0 auto;
      text-align: right;
    }

    margin-right: 10px;
    margin-left: 0;
  }
`

export const DotsWrapper = styled.svg`
  visibility: ${props => props.enabled ? 'visible' : 'hidden'};
  pointer-events: ${props => props.enabled ? 'initial' : 'none'};

  #Trending-Unopened {
    fill: #FFF;
    stroke: #A7A7A7;
  }

  &:hover #Trending-Unopened {
    fill: ${props => props.color};
  }
`

export const RangeSlider = styled.div`
  width: 231px;
  display: inline-block;

  ul {
    padding: 0;
    position: absolute;
    z-index: 0;
    top: 67px;

    li {
      color: #2E2E2E;
      font-size: 11px;

      div {
        box-sizing: border-box;
        height: 10px;
        width: 2px;
        border: 1px solid #979797;
        margin-left: 2px;
        margin-bottom: 4px;
      }

      &:last-child {
        padding: 0;
      }

      &:first-child {
        div {
          margin-left: 0;
        }
      }

      display: inline-block;
      list-style-type: none;
      padding-right: 50px;
    }
  }

  input[type='range'] {
    appearance: none;
    width: 231px;
    height: 2px;
    border-radius: 5px;
    background: #D3D3D3;
    outline: none;
    position: absolute;
    z-index: 1;

    &::-webkit-slider-thumb {
      appearance: none;
      width: 10px;
      height: 24px;
      border: 0;
      background: url(data:image/png;base64,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);
      cursor: pointer;
    }

    &::-moz-range-thumb {
      appearance: none;
      width: 10px;
      height: 24px;
      border: 0;
      background: url(data:image/png;base64,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);
      cursor: pointer;
    }
  }
`
export const AddConfidenceModal = styled.div`
  article {
    position: absolute;
    z-index: 200;
    top: 0;
    height: 100%;
    background: #2525254F;
    width: 560px;
  }

  section {
    background: white;
    z-index: 300;
    margin-top: 12%;
    padding-bottom: 3px;
    position: absolute;
    top: 0;
    width: 560px;

    input[type='text'] {
      border: 1px solid #6A6A6A;
      padding: 7px 6px;
      font-size: 16px;
      height: auto;
      width: 260px;
      margin: 15px 31px;
    }

    h6 {
      font-size: 13px;
      font-weight: normal;
    }

    .btn-confidence {
      background: #DADADA;
      margin-top: 13px;
      margin-left: calc(50% - 79px);
      margin-bottom: 13px;
      border-radius: 2px;
      color: #6A6A6A;
      font-size: 13px;
      font-weight: 500;
      font-family: HKGrotesk, sans-serif;
    }

    .btn-submit {
      background: #6A6A6A;
      color: #FFF;
      display: block;
      font-size: 13px;
      border-radius: 2px;
      font-weight: 100;
      position: relative;
      left: calc(100% - 120px);
      margin: 18px 0;
      width: 100px;
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
`

export const ConfidenceCard = styled.div`
  padding: 20px;
  border: 0.75px solid #6A6A6A;
  margin: 25px;

  h6 {
    font-size: 13px;
    font-weight: normal;
  }

  textarea {
    width: 100%;
  }

  button {
    border: 0.75px solid #6A6A6A;
    display: inline-block;
    margin-left: 78px;
    border-left: none;
    line-height: 35px;
    color: #323232;
    font-size: 13px;
    font-weight: 500;
    font-family: HKGrotesk, sans-serif;
    width: 117px;

    &::after {
      content: '';
      display: block;
      position: relative;
      top: -31px;
      width: 28px;
      height: 28px;
      left: -21px;
      background: #FFF0;
      border-right: 1px solid #6A6A6A;
      border-bottom: 1px solid #6A6A6A;
      transform: rotate(134deg);
    }

    &:focus {
      outline: unset;
    }
  }
`

export const CreationSuggestionsWrapper = styled.div`
  p {
    color: #888B94;
  }
`

export const TabTextContent = styled.p`
  padding: 0 20px;
`

export const MetadataTable = styled.table`
  width: 100%;
  margin-top: 20px;
  font-size: 14px;

  tr:nth-child(odd) {
    background-color: #E1E1E1;
  }

  td:first-child {
    padding: 3px 20px;
    min-width: 150px;
    vertical-align: top;
  }
`
