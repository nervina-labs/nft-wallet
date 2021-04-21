import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { Appbar } from '../../components/Appbar'
import { Button } from '../../components/Button'
import { RoutePath } from '../../routes'
import { MainContainer } from '../../styles'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  height: 100%;

  .main {
    flex: 1;
    background: linear-gradient(187.7deg, #ffffff 4.33%, #f0f0f0 94.27%);
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
      <Appbar title="页面丢失" />
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
