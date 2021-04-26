import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { ReactComponent as LogoSvg } from '../../assets/svg/logo.svg'
import WalletBg from '../../assets/svg/wallet_bg.svg'
import { Button } from '../../components/Button'
import { useWalletModel } from '../../hooks/useWallet'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { MAIN_NET_URL, TEST_NET_URL } from '../../constants'
import { NetChange } from '../../components/NetChange'

// @ts-expect-error
const containerBg = WalletBg as string

const Container = styled(MainContainer)`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  flex-direction: column;
  background-position: bottom;
  background-repeat: no-repeat;
  background-size: cover;
  // @ts-ignore
  background-image: url(${containerBg});

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
    margin-top: 80px;
    margin-bottom: 56px;
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
    await login()
    setIsLoging(false)
    history.push(RoutePath.NFTs)
  }, [login, history])

  return (
    <Container>
      <div className="header">
        <Title style={{ marginRight: '8px' }}>秘宝账户</Title>
        <NetChange mainnetURL={MAIN_NET_URL} testnetURL={TEST_NET_URL} />
      </div>
      <LogoSvg className="logo" />
      <Button
        onClick={loginBtnOnClick}
        type="default"
        disbaled={isLogining}
        isLoading={isLogining}
      >
        连接账户
      </Button>
    </Container>
  )
}
