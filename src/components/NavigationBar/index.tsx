import React from 'react'
import styled from 'styled-components'
import { ReactComponent as BackIcon } from '../../assets/svg/back.svg'

export const NAVIGATION_BAR_HEIGHT = 44

const Container = styled.nav`
  --height: ${NAVIGATION_BAR_HEIGHT}px;
  --bg-color: #fff;

  .main {
    display: flex;
    width: 100%;
    height: var(--height);
    line-height: var(--height);
    position: fixed;
    top: 0;
    left: 0;
    background-color: var(--bg-color);
    z-index: 1000;

    .back {
      height: 100%;
      width: var(--height);
      margin: auto 0;
      display: flex;
      position: absolute;
      top: 0;
      left: 0;
      svg {
        margin: auto;
        height: 17px;
      }
    }
    .title {
      width: 100%;
      height: 100%;
      text-align: center;
      font-weight: 500;
      font-size: 16px;
    }
  }

  .seat {
    width: 100%;
    height: ${NAVIGATION_BAR_HEIGHT}px;
  }
`

export interface NavigationBarProps {
  title: string
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ title }) => {
  return (
    <>
      <Container>
        <div className="main">
          <div className="back">
            <BackIcon />
          </div>
          <div className="title">{title}</div>
        </div>
        <div className="seat" />
      </Container>
    </>
  )
}
