import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode.react'
import { truncateMiddle, copyFallback, sleep } from '../../utils'
import { useWalletModel } from '../../hooks/useWallet'
import { useTranslation } from 'react-i18next'
import Bg from '../../assets/img/qrcode-bg.png'
import { Button } from '../../components/Button'
import { ReactComponent as CheckSvg } from '../../assets/svg/check-circle.svg'
import * as clipboard from 'clipboard-polyfill/text'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 80px;
  flex-direction: column;

  .title {
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
    color: #0e0e0e;
    margin-top: 0;
    margin-bottom: 0;
  }
  .qrcode-bg {
    margin-top: 30px;
    background: white url(${Bg});
    background-repeat: no-repeat;
    background-size: cover;
    width: 188px;
    height: 188px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .qr-code {
    width: 150px;
    height: 150px;
  }

  button {
    margin-top: 30px;
    .copied {
      display: flex;
      align-items: center;
      justify-content: center;
      svg {
        margin-left: 4px;
        width: 12px;
        height: 12px;
      }
    }
  }
`

export const Info: React.FC = () => {
  const { address } = useWalletModel()
  const { t } = useTranslation('translations')
  const [isCopying, setIsCopy] = useState(false)

  const onCopy = useCallback(async () => {
    setIsCopy(true)
    try {
      await clipboard.writeText(address)
    } catch (error) {
      copyFallback(address)
    }
    await sleep(2000)
    setIsCopy(false)
  }, [address])

  const qrCodeContent = useMemo(
    () => (
      <>
        <div className="qrcode-bg">
          <QRCode
            style={{ width: '150px', height: '150px' }}
            className="qr-code"
            value={address}
          />
        </div>
      </>
    ),
    [address]
  )
  return (
    <Container>
      <h3 className="title">{t('info.title')}</h3>
      {qrCodeContent}
      <h3 className="title" style={{ marginTop: '30px' }}>
        {truncateMiddle(address, 10, 6)}
      </h3>
      <Button type="primary" onClick={onCopy} disbaled={isCopying}>
        {isCopying ? (
          <span className="copied">
            {t('info.copied')}
            <CheckSvg />
          </span>
        ) : (
          t('info.copy')
        )}
      </Button>
    </Container>
  )
}
