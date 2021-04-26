import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { Button } from '../../components/Button'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'
import { ReactComponent as AccountSvg } from '../../assets/svg/account.svg'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  height: 100%;

  .main {
    flex: 1;
    margin-top: 180px;
    .content {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      .title {
        font-weight: bold;
        font-size: 20px;
        line-height: 24px;
        color: rgba(0, 0, 0, 0.6);
      }
      .desc {
        font-weight: 600;
        font-size: 16px;
        line-height: 22px;
        color: rgba(0, 0, 0, 0.6);
        margin-top: 16px;
      }
      button {
        margin-top: 32px;
      }
    }
  }
`

export const NotFound: React.FC = () => {
  const history = useHistory()
  return (
    <Container>
      <Appbar
        title="页面丢失"
        left={
          <AccountSvg
            onClick={() => {
              history.push(RoutePath.Info)
            }}
          />
        }
        right={<div />}
      />
      <section className="main">
        <div className="content">
          <div className="title">404</div>
          <div className="desc">您所寻找的页面不存在</div>
          <Button type="default" onClick={() => history.push(RoutePath.NFTs)}>
            返回我的秘宝
          </Button>
        </div>
      </section>
    </Container>
  )
}
