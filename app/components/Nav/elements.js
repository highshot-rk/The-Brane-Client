import styled from 'styled-components'

export const NavWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 20px 0 20px;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

  svg {
    opacity: 0.9;
    fill: #FFF;
    margin-right: 12px;
  }

  a {
    margin-right: 28px;
    font-size: 18px;
    font-weight: 300;
    font-family: Montserrat, sans-serif;
    color: #FDFDFD;
    text-decoration: none;
    padding-top: 4px;
    display: ${props => props.hideLinks ? 'none' : 'block'};
  }

  a.join {
    background: white;
    padding: 10px 30px;
    text-align: center;
    color: #2E2E2E;
    line-height: 18px;
  }
`

export const Brand = styled.div`
  color: #DDD;
  font-size: 22px;
  font-family: Montserrat, sans-serif;
  font-weight: 200;
  flex-grow: 1;
`

export const Join = styled.a`
  /* empty */
`
