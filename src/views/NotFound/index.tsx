import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { Button } from '../../components/Button'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import NotFoundPng from '../../assets/img/404.png'
import AccountPng from '../../assets/img/account-black.png'
import { useTranslation } from 'react-i18next'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  height: 100%;

  > header {
    background: transparent;
    box-shadow: none;
  }

  .main {
    flex: 1;
    margin-top: 180px;
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      img {
        width: 220px;
      }
      .desc {
        margin-top: 16px;
        line-height: 16px;
        font-size: 12px;
        color: #0e0e0e;
      }
      button {
        margin-top: 32px;
      }
    }
  }
`

export const NotFound: React.FC = () => {
  const history = useHistory()
  const { t } = useTranslation('translations')
  return (
    <Container>
      <Appbar
        title={t('404.title')}
        left={
          <img
            src={AccountPng}
            onClick={() => {
              history.push(RoutePath.Info)
            }}
          />
        }
        right={<div />}
      />
      <section className="main">
        <div className="content">
          <img src={NotFoundPng} alt={t('404.not-found')} />
          <div className="desc">{t('404.not-found')}</div>
          <Button type="primary" onClick={() => history.push(RoutePath.NFTs)}>
            {t('404.back')}
          </Button>
        </div>
      </section>
    </Container>
  )
}
