import styled from 'styled-components'
import { MainContainer } from '../../styles'
import { HEADER_HEIGHT } from '../../components/Appbar'

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
    transition: all 0.3s;
    position: sticky;
    top: 0;
    z-index: 10;

    &.fixed {
      position: fixed;
      top: 0;
      justify-content: center;
      border-radius: 0;
      background: rgba(255, 255, 255, 0.9);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(10px);
    }
    .filter {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      position: relative;
      justify-content: center;
      align-items: center;
      margin-right: 48px;
      &:last-child {
        margin-right: 0;
      }
    }
    .active-line {
      background: #ff5c00;
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
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
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
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
    svg {
      -webkit-touch-callout: none;
      width: 32px;
      height: 32px;
    }
  }
  .bg {
    position: relative;
    top: 0;
    width: 100%;
    padding: calc(${HEADER_HEIGHT ?? 0}px + 20px) 20px 20px;
    max-width: calc(100% - 40px);
    display: flex;
    flex-direction: column;
    transition: 100ms;

    .info {
      position: relative;
      z-index: 1;
    }

    .bg-image {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: auto;
      z-index: 0;
    }

    @media (min-width: 500px) {
      max-width: 460px;
    }
    &.loading {
      align-items: center;
      justify-content: center;
    }
    /* padding-left: 16px; */
    .desc {
      margin-top: 12px;
      color: black;
      font-size: 14px;
      line-height: 16px;
      margin-bottom: 24px;
      white-space: pre-line;
      word-break: break-all;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 4; /* number of lines to show */
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
    user-select: none;
    flex: 1;
    background: #f8fafd;
    border-radius: 35px 35px 0 0;
    z-index: 2;
    img {
      -webkit-user-drag: none;
      -webkit-touch-callout: none;
    }

    .infinite-scroll-component {
      > div {
        &:nth-child(2) {
          margin-top: 20px;
        }
      }
    }
  }
`
