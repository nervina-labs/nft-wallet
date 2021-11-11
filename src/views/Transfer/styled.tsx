import styled from 'styled-components'
import Bg from '../../assets/img/transfer-bg.jpg'
import { MainContainer } from '../../styles'

export const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  background: url(${Bg});
  background-size: cover;
  background-repeat: repeat-y;
  height: 100vh;
  .footer {
    position: fixed;
    bottom: 20px;
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 500px;
  }
  section {
    &.main {
      flex: 1;
    }
    .boxes {
      overflow: hidden;
    }
    .desc {
      font-size: 12px;
      color: #8d8989;
      line-height: 16px;
      margin: 0 15px;
      margin-top: 10px;
      text-align: center;
    }
  }
  .success {
    color: #1fd345;
    font-size: 12px;
  }
`

export const DrawerContainer = styled.div`
  margin: 15px;
  margin-bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .header {
    display: flex;
    width: 100%;
    span {
      flex: 1;
    }
    svg {
      margin-left: auto;
      cursor: pointer;
    }
  }
  .card {
    margin-top: 20px;
    img {
      border-radius: 10px;
    }
  }
  .title {
    margin-top: 20px;
    font-size: 12px;
    font-weight: bold;
    color: #0e0e0e;
  }
  .address {
    margin-top: 10px;
    font-size: 12px;
    color: #0e0e0e;
    word-break: break-all;
    width: 250px;
    text-align: center;
    margin-bottom: 0;
  }
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
    margin-bottom: 32px;
    .loading {
      margin-left: 10px;
    }
  }
`

export const Box = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  background: white;
  border-radius: 22px;
  margin: 50px 20px 50px 20px;
  padding: 0 14px;
  padding-top: 20px;
  z-index: 3;
  label {
    font-size: 18px;
    color: #0e0e0e;
    margin-bottom: 20px;
  }
  .form {
    border-radius: 30px;
    background: #f0f0f1;
    min-height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 18px 12px;
    .input {
      background: transparent;
      flex: 1;
      width: 100%;
      border: none;
      overflow: auto;
      outline: none;
      border-radius: 0;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      resize: none;
      margin-right: 4px;
      font-size: 14px;
    }
    &-extra {
      position: relative;

      .scan-btn {
        margin-left: 4px;
        display: block;
      }

      &.das {
        .scan-btn {
          position: absolute;
          right: 0;
          top: -55px;
        }
      }
    }
  }

  .action {
    position: relative;
    z-index: 3;
    top: 20px;
    button {
      &:disabled {
        opacity: 1;
        background: #e6e8ec;
      }
    }
  }

  .alert {
    font-weight: 600;
    font-size: 10px;
    display: flex;
    align-items: center;
    margin-top: 10px;
    /* height: 34px; */
    svg {
      width: 12px;
      height: 12px;
      margin-right: 4px;
    }
    &.error {
      color: #d03a3a;
    }
    &.info {
      color: #2196f3;
    }
  }
`

export const DasSelectorContainer = styled.div`
  position: relative;
  display: ${(props: { visible: boolean }) =>
    props.visible ? 'flex' : 'none'};
  .info {
    box-sizing: border-box;
    padding: 2px;
    height: 26px;
    border-radius: 13px;
    background-color: rgba(35, 38, 75, 0.06);
    display: flex;
    align-items: center;

    .avatar {
      flex-grow: 0;
      flex-shrink: 0;
      height: 22px;
      width: 22px;
      text-align: center;
      background-color: #fff;
      border-radius: 50%;
      overflow: hidden;
      color: rgba(35, 38, 75, 0.5);

      img {
        display: block;
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
    }

    .account {
      font-size: 12px;
      font-weight: 500;
      padding: 0 5px 0 7px;
    }

    .loading {
      margin-top: 3px;
    }
  }
`

export const DasSelectorPopoutMask = styled.div`
  position: fixed;
  display: none;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 10;

  &.visible {
    display: block;
  }
`

export const DasSelectorPopoutContainer = styled.div`
  box-sizing: border-box;
  position: absolute;
  padding: 0 12px;
  left: 50%;
  transform: translate(-50%, 0);
  display: none;
  width: calc(100vw - 20px);
  max-width: 480px;
  border: #dbdeeb solid 1px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: 0px 22px 14px 0px rgba(0, 0, 0, 0.07);
  font-size: 14px;
  z-index: 11;

  .triangle {
    position: absolute;
    top: 0;
    right: 61px;

    &::before,
    &::after {
      content: '';
      display: block;
      box-sizing: border-box;
      position: absolute;
      background: #fff;
      width: 10px;
      height: 10px;
      transform: rotate(45deg);
    }

    &::before {
      top: -5px;
      border: #dbdeeb solid 1px;
    }

    &::after {
      top: -4px;
    }
  }

  &.visible {
    display: block;
  }

  &.selected {
    .record {
      padding-left: 36px;
    }
  }

  .empty {
    padding: 40px 0;
    color: #717391;
    text-align: center;
  }

  .title {
    color: #717391;
    font-weight: 500;
    margin-top: 12px;
    margin-bottom: 8px;
  }

  .list {
    padding-bottom: 4px;
    max-height: 190px;
    overflow-y: auto;
  }

  .record {
    position: relative;
    background-color: #e9ebf8;
    border-radius: 4px;
    padding: 8px;
    margin-bottom: 8px;
    font-weight: 500;
    cursor: pointer;

    .value {
      margin-bottom: 4px;
      word-break: break-all;
      line-height: 20px;
    }

    .label {
      color: #2471fe;

      span {
        padding: 1px 4px;
        background-color: #fff;
        border-radius: 3px;
      }
    }

    .check {
      position: absolute;
      width: 20px;
      height: 20px;
      top: 8px;
      left: 8px;

      svg {
        height: 100%;
        width: 100%;
      }
    }
  }
`
