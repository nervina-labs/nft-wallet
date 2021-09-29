import React from 'react'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { MainContainer } from '../../styles'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { Appbar } from '../../components/Appbar'
import { useTranslation } from 'react-i18next'
import { ReactComponent as SaveImage } from '../../assets/svg/save-image.svg'
import { ReactComponent as Scan } from '../../assets/svg/shop-scan.svg'
import ShopJpg from '../../assets/img/shop.jpg'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import { downloadImage } from '../../utils'

const defaultQrCode = ShopJpg as any

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;

  .detail {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .content {
    border-radius: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: #dde6e7;
    margin-top: 24px;
    margin-left: 15px;
    margin-right: 15px;

    .title {
      margin-top: 40px;
      text-align: center;
      .desc {
        margin-top: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #d0a741;
        svg {
          margin-right: 8px;
        }
      }
    }

    .media {
      background: rgba(255, 255, 255, 0.5);
      padding: 25px;
      margin-top: 56px;
      margin-bottom: 70px;
      img {
        max-width: 200px;
        max-height: 200px;
      }
    }

    .action {
      margin-bottom: 30px;
      button {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: black;
        color: white;
        border-radius: 30px;
        border: none;
        padding: 8px 33px;
        svg {
          margin-right: 8px;
        }
      }
    }
  }
`

export const Shop: React.FC = () => {
  const history = useHistory()
  const [t] = useTranslation('translations')
  const qrcode = useRouteQuery('qrcode', '')
  const qrcodeSrc = decodeURIComponent(qrcode) || defaultQrCode
  return (
    <Container>
      <Appbar
        title={t('shop.title')}
        left={<BackSvg onClick={() => history.goBack()} />}
        right={<div />}
      />
      <section className="detail">
        <div className="content">
          <div className="title">
            <div className="desc">
              <Scan />
              <span>{t('shop.scan')}</span>
            </div>
            <div className="desc">{t('shop.desc')}</div>
          </div>
          <div className="media">
            <img src={qrcodeSrc} />
          </div>
          <div className="action">
            <button onClick={async () => await downloadImage(qrcodeSrc)}>
              <SaveImage />
              {t('shop.save')}
            </button>
          </div>
        </div>
      </section>
    </Container>
  )
}
