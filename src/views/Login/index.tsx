import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import Logo from '../../assets/img/logo.png'
import { useWalletModel } from '../../hooks/useWallet'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { MAIN_NET_URL, TEST_NET_URL } from '../../constants'
import { NetChange } from '../../components/NetChange'
import Button from '@material-ui/core/Button'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { CircularProgress } from '@material-ui/core'
import { LazyLoadImage } from '../../components/Image'

const Container = styled(MainContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: cover;

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    .status {
      margin-right: 4px;
      font-weight: normal;
      font-size: 12px;
      line-height: 17px;
      color: #000000;
    }
  }
  .logo {
    margin-top: 20px;
    margin-bottom: 20px;
  }
`

const BtnGroup = styled(ButtonGroup)`
  width: calc(100% - 40px);
  button {
    color: black;
    font-weight: 500;
    padding: 12px 6px 12px 16px;
    .MuiButton-label {
      justify-content: flex-start;
      text-transform: none;
      font-size: 14px;
      line-height: 22px;
    }
    &:disabled {
      font-weight: 300;
      color: rgba(0, 0, 0, 0.6);
    }
    &.MuiButton-outlinedPrimary {
      border: 1px solid rgba(0, 0, 0, 0.23);
      border-bottom: none;
      &:last-child {
        border: 1px solid rgba(0, 0, 0, 0.23);
      }
      /* border-bottom: none; */
    }
  }
`

const Title = styled.h2`
  font-weight: 600;
  font-size: 20px;
  line-height: 28px;
  color: #000000;
  margin: 0;
`

export const Login: React.FC = () => {
  const { login } = useWalletModel()
  const history = useHistory()
  const [isLogining, setIsLoging] = useState(false)
  const loginBtnOnClick = useCallback(async () => {
    setIsLoging(true)
    try {
      await login()
      setIsLoging(false)
      history.push(RoutePath.NFTs)
    } catch (error) {
      setIsLoging(false)
    }
  }, [login, history])

  return (
    <Container>
      <div className="header">
        <Title style={{ marginRight: '8px' }}>秘宝账户</Title>
        <NetChange mainnetURL={MAIN_NET_URL} testnetURL={TEST_NET_URL} />
      </div>
      <div className="logo">
        <LazyLoadImage src={Logo as any} width={340} height={410} />
      </div>
      <BtnGroup
        orientation="vertical"
        color="primary"
        aria-label="vertical outlined primary button group"
      >
        <Button disabled={isLogining} onClick={loginBtnOnClick}>
          连接 Unipass（推荐）
          {isLogining ? (
            <CircularProgress className="loading" size="1em" />
          ) : null}
        </Button>
        <Button disabled>连接 Metamask（筹备中...）</Button>
        <Button disabled>连接 Wallet Connect（筹备中...）</Button>
      </BtnGroup>
    </Container>
  )
}
