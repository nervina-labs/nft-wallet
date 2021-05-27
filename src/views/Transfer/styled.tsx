import styled from 'styled-components'
import Bg from '../../assets/img/transfer-bg.png'
import { MainContainer } from '../../styles'

export const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  background: #ecf2f5;
  > header {
    background: transparent;
    box-shadow: none;
  }
  section {
    &.main {
      flex: 1;
      background: #ecf2f5 url(${Bg});
      background-repeat: no-repeat;
      background-size: contain;
      background-position: bottom;
    }
    .boxes {
      height: 340px;
      max-height: 340px;
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
  height: 220px;
  position: relative;
  background: white;
  border-radius: 20px;
  margin: 0 15px;
  margin-top: 80px;
  padding: 0 40px;
  z-index: 3;
  label {
    font-size: 16px;
    color: #0e0e0e;
    font-weight: bold;
    margin: 20px 0;
  }
  .form {
    border-radius: 30px;
    background: #f0f0f1;
    min-height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    padding: 10px 20px;
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
    }
    svg {
      path {
        fill: #6e8ae6;
      }
    }
  }

  .action {
    position: relative;
    z-index: 3;
    top: 30px;
    .transfer {
      width: 66px;
      height: 66px;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      background: #fd5c31;
      box-shadow: 11px 6px 9px 0px rgba(253, 92, 49, 0.19);
      font-size: 20px;
      border-radius: 50%;
      color: white;
      &.disabled {
        background-color: #ddd;
        color: #898989;
        cursor: not-allowed;
        box-shadow: none;
      }
      img {
        width: 22px;
      }
    }
  }

  .alert {
    font-weight: 600;
    font-size: 10px;
    display: flex;
    align-items: center;
    margin-top: 10px;
    height: 34px;
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
