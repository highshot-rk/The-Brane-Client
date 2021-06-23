import styled, { css } from 'styled-components'

export const Wrapper = styled.div`
  /* empty */
`

export const Title = styled.h3`
  cursor: pointer;
  color: #646464;

  svg {
    margin-right: 10px;
    transform: rotate(${props => props.collapsed ? '90deg' : '-90deg'});
  }

  span {
    font-weight: inherit;
    font-size: 16px;
  }
`

export const Lineage = styled.div`
  border-left: 1px solid black;
  margin-left: 55px;
  margin-top: 43px;
  margin-bottom: 60px;

  &::before {
    position: relative;
    background-color: white;
    width: 100px;
    height: 4px;
    margin-bottom: -5px;
    margin-left: -1px;
    display: block;
    content: '';
  }

  &::after {
    position: relative;
    background-color: white;
    width: 2px;
    height: 3px;
    margin-top: -16px;
    margin-left: -1px;
    display: block;
    content: '';
  }
`

export const Item = styled.div`
  display: block;
  margin-bottom: 10px;
  ${props => !props.time ? css`
  display: flex;
  align-items: center;
  ` : ''}
  cursor: pointer;
  width: 100%;
  flex-wrap: wrap;
  font-size: 18px;
  color: #646464;

  &:last-child {
    p:first-child {
      padding-bottom: 4px;
      margin-bottom: -2;
    }
  }

  p {
    display: inline-block;
    margin-top: 0;
    margin-bottom: 0;
    color: #646464;

    strong {
      color: #000;
    }
  }

  &:first-child p:first-child {
    margin-top: -2px;
    padding-top: 7px;
    vertical-align: text-top;
  }
`

export const Time = styled.p`
  display: inline-block;
  background: white;
  margin-left: -20px;
  text-align: center;
  width: 40px;
  font-size: 8px;
  vertical-align: unset;
  color: #646464;
  font-weight: 300;
`

export const Circle = styled.div`
  display: inline-block;
  border: 2px solid #2E2E2E;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  background-color: ${props => props.active ? '#000' : '#fff'};
  margin-left: -8px;
  margin-right: 10px;
  margin-top: -1px;
`
