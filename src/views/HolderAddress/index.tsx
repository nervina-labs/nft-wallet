import styled from 'styled-components'
import { MainContainer } from '../../styles'
import React from 'react'
import { Info } from '../Info'
import { Appbar } from '../../components/Appbar'
import { useParams } from 'react-router'
import AccountBg from '../../assets/img/account-bg.png'
import { ReactComponent as FullLogo } from '../../assets/svg/full-logo.svg'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: url(${AccountBg});
  background-size: cover;
  background-repeat: repeat-y;

  .detail {
    flex: 1;
    padding: 0 24px;
    padding-top: 50px;
    padding-bottom: 20px;
  }

  .content {
    width: 100%;
  }

  .footer {
    position: fixed;
    bottom: 20px;
    display: flex;
    justify-content: center;
    width: 100%;
    max-width: 500px;
  }
`

export const HolderAddress: React.FC = () => {
  const { address } = useParams<{ address: string }>()
  return (
    <Container>
      <Appbar right={<></>} transparent />
      <section className="detail">
        <Info address={address} />
      </section>
      <footer className="footer">
        <FullLogo />
      </footer>
    </Container>
  )
}
