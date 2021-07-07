import styled from 'styled-components'
import { MainContainer } from '../../styles'
import Bg from '../../assets/svg/home-bg.svg'

export const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 0;
  position: relative;
  h4 {
    text-align: center;
    color: rgba(0, 0, 0, 0.6);
  }
  .filters {
    margin-right: 15px;
    font-size: 14px;
    color: #333333;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 100%;
    max-width: 500px;
    border-bottom: 1px solid #ececec;
    background-color: white;
    border-top-left-radius: 35px;
    border-top-right-radius: 35px;
    transition: all 0.3s;
    &.fixed {
      position: fixed;
      top: 0;
      justify-content: center;
      z-index: 3;
      border-radius: 0;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(10px);
    }
    .filter {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      position: relative;
      justify-content: center;
      align-items: center;
      &:first-child {
        margin-right: 48px;
      }
    }
    .active-line {
      background: #ff5c00;
      border-radius: 10px;
      position: absolute;
      border-radius: 10px;
      height: 3px;
      width: 28px;
      position: relative;
      top: 1px;
    }
  }
  .share {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 10px 6px 15px;
    background: rgba(255, 246, 235, 0.553224);
    backdrop-filter: blur(13px);
    position: fixed;
    right: 0;
    top: 15px;
    border-top-left-radius: 20px;
    border-bottom-left-radius: 20px;
    z-index: 10;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
    font-size: 13px;
    line-height: 18px;
    color: #333;
    svg {
      margin-right: 6px;
    }
  }

  @media (min-width: 500px) {
    .share {
      right: calc(50% - 250px);
    }
  }
  .account {
    position: absolute;
    left: 15px;
    top: 15px;
    cursor: pointer;
    svg {
      width: 32px;
      height: 32px;
    }
  }
  .bg {
    position: fixed;
    top: 0;
    width: 100%;
    max-width: 500px;
    height: 245px;
    background: darkgray url(${Bg as any});
    background-repeat: no-repeat;
    background-size: cover;
    background-position: 0 -80px;
    display: flex;
    flex-direction: column;
    &.loading {
      align-items: center;
      justify-content: center;
    }
    /* padding-left: 16px; */
    .desc {
      margin-left: 25px;
      margin-right: 25px;
      margin-top: 16px;
      color: white;
      font-size: 14px;
      line-height: 16px;
      white-space: pre-line;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3; /* number of lines to show */
      -webkit-box-orient: vertical;
    }
  }
  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    > span {
      font-size: 16px;
      margin-right: 8px;
    }
  }
  .list {
    flex: 1;
    background-color: white;
    background: #ecf2f5;
    border-radius: 35px 35px 0px 0px;
    margin-top: 199px;
    z-index: 2;
    .infinite-scroll-component {
      > div {
        &:nth-child(2) {
          margin-top: 20px;
        }
      }
    }
  }
`
