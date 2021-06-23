import styled from 'styled-components'

export const QuestionContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`

export const QuestionForm = styled.div`
  padding-top: 162px;
  width: 75%;

  .alt-styling {
    padding-top: 110px;
  }

  .q-width {
    width: 65.593561368%;
  }

  .q-width2 {
    width: 80%;
  }

  .q-btn {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 64px;
  }

  @media screen and (max-width: 1024px) {
    padding-top: 77.77px;
    padding-left: 72px;
    padding-right: 72px;
    width: 100%;

    .alt-styling {
      padding-top: 25.77px;
    }

    .q-width {
      width: 100%;
    }

    .q-width3 {
      width: 100%;
    }
  }

  @media screen and (max-width: 733px) {
    padding-top: 0.1px;
    width: 100%;
    height: 100%;
  }

  @media screen and (max-width: 414px) {
    padding-left: 0.1px;
    padding-right: 0.1px;

    .alt-styling {
      min-height: 80vh;
      overflow: auto;
    }

    .q-width2 {
      width: 100%;
    }

    .q-width3 {
      line-height: 125%;
      width: 345px;
    }
  }

  @media screen and (max-width: 320px) {
    .q-width3 {
      line-height: 125%;
      width: 100%;
    }
  }
`
