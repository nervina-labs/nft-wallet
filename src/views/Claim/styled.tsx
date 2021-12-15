import styled from 'styled-components'
import { MainContainer } from '../../styles'

export const Container = styled(MainContainer)`
  padding: 0;
  min-height: 100%;
  max-width: 500px;
  flex-direction: column;
  display: flex;
  .bg {
    img,
    svg {
      width: 100%;
      max-width: 100%;
    }
    position: relative;
    display: flex;
    justify-content: center;
  }

  .question {
    display: flex;
    justify-content: center;
    align-items: center;
    color: #232222;
    font-size: 12px;
    margin-top: 30px;
    cursor: pointer;
    svg {
      margin-right: 4px;
    }
  }

  .action {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: white;
    flex-direction: column;
    border-top-left-radius: 35px;
    border-top-right-radius: 35px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
    min-height: 300px;
    .input {
      background: #f6f6f6;
      border: 1px solid #d1d1d1;
      box-sizing: border-box;
      border-radius: 20px;
      margin: 12px 0;
      height: 46px;
      text-align: center;
      min-width: 295px;
      .error {
        border: 1px solid #ff0000;
      }
      &:focus {
        outline: none;
      }
    }
    .desc {
      font-size: 18px;
      line-height: 25px;
      color: #fe7a0c;
      &.error {
        color: #ff0000;
      }
    }
    p {
      font-size: 14px;
      color: #000000;
      margin: 0 20px;
      margin-bottom: 14px;
    }

    .connect {
      &.metamask {
        background-color: #d7e4e3;
      }
      border: 1px solid #d2d2d2;
      border-radius: 25px;
      width: 295px;
      margin-left: 50px;
      margin-right: 50px;
      margin-top: 12px;
      font-size: 16px;

      .imtoken {
        margin: 0 4px;
      }

      svg {
        g {
          fill: white;
        }
      }

      &:disabled {
        color: rgb(214, 214, 214) !important;
        background-color: white !important;

        svg {
          g {
            fill: rgb(214, 214, 214);
          }
        }
      }
      &.MuiButton-text {
        padding-top: 8px;
        padding-bottom: 8px;
        text-transform: none;
      }
      &.recommend {
        background: #2b454e;
        color: white;
      }
    }
  }
`
