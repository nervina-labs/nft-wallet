import styled from 'styled-components'
import { MainContainer } from '../../styles'

export const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  background: #ecf2f5;
  .content {
    display: flex;
    flex-direction: column;
    margin: 0 36px;
    height: 100%;
    flex: 1;
    label {
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.6);
      margin-top: 120px;
      margin-bottom: 12px;
    }
    .alert {
      font-weight: 600;
      font-size: 12px;
      line-height: 17px;
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
    .form {
      display: flex;
      justify-content: center;
      align-items: center;
      .input {
        background: transparent;
        width: 100%;
        border: none;
        overflow: auto;
        outline: none;
        border-radius: 0;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        resize: none;
        border-bottom: 1px solid #000000;
      }
      svg {
        margin-left: 10px;
      }
    }
    .action {
      display: flex;
      justify-content: center;
      margin-top: 35px;
    }
    .desc {
      margin-top: auto;
      margin-bottom: 50px;
      font-weight: 600;
      font-size: 14px;
      line-height: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      color: rgba(0, 0, 0, 0.6);
      p {
        margin: 0;
      }
    }
  }
`

export const DrawerContainer = styled.div`
  margin: 32px 36px;
  margin-bottom: 0;
  .header {
    display: flex;
    align-items: center;
    label {
      font-style: normal;
      font-weight: 600;
      font-size: 14px;
      line-height: 16px;
      color: rgba(0, 0, 0, 0.6);
      margin: 0;
      display: flex;
      align-items: center;
    }
    svg {
      margin-left: auto;
      cursor: pointer;
    }
  }
  .card {
    margin-top: 8px;
    margin-bottom: 32px;
    display: flex;
    height: 80px;
    .info {
      margin: 4px 0;
      flex: 1;
      margin-left: 12px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      font-weight: 600;
      font-size: 12px;
      line-height: 17px;
      overflow: hidden;
      .title {
        color: #000000;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .row {
        color: rgba(0, 0, 0, 0.6);
      }
    }
  }
  .address {
    margin-top: 12px;
    font-size: 14px;
    line-height: 16px;
    color: #000000;
    font-weight: 600;
    word-break: break-all;
  }
  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 32px;
    margin-bottom: 40px;
    .loading {
      margin-left: 10px;
    }
  }
`
