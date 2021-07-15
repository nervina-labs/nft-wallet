import React, { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode.react'
import { copyFallback, sleep } from '../../utils'
import { useWalletModel } from '../../hooks/useWallet'
import { useTranslation } from 'react-i18next'
import { Button } from '../../components/Button'
import { ReactComponent as CheckSvg } from '../../assets/svg/check-circle.svg'
import { ReactComponent as WarningSvg } from '../../assets/svg/warning.svg'
import * as clipboard from 'clipboard-polyfill/text'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  .warning {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 32px;
    padding: 0 20px;
    span {
      font-size: 12px;
      margin-left: 8px;
      color: #000000;
    }
  }
  .address {
    background: #e5eced;
    border-radius: 10px;
    padding: 16px;
    margin-top: 8px;
    margin-left: 16px;
    margin-right: 16px;
    p {
      font-size: 14px;
      line-height: 20px;
      text-align: justify;
      text-align-last: center;
      word-break: break-all;
      color: #666666;
      margin: 0;
    }
  }
  h4 {
    margin: 0;
    font-size: 12px;
    line-height: 17px;
    color: #d0a741;
  }
  .title {
    font-weight: bold;
    font-size: 16px;
    line-height: 19px;
    color: #0e0e0e;
    margin-top: 0;
    margin-bottom: 0;
  }
  .content {
    background: #dde6e7;
    box-shadow: 0px 4px 10px rgba(190, 190, 190, 0.2);
    border-radius: 16px;
    margin: 14px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .qrcode-bg {
    margin-top: 13px;
    background: #e5eced;
    border-radius: 8px;
    width: 188px;
    height: 188px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 80px;
  }
  .qr-code {
    width: 156px;
    height: 156px;
  }

  button {
    margin-top: 24px;
    margin-bottom: 24px;
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
            style={{ width: '156px', height: '156px' }}
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
      <div className="warning">
        <WarningSvg />
        <span>{t('account.warning')}</span>
      </div>
      <div className="content">
        <h4 style={{ marginTop: '60px' }}>{t('account.qrcode')}</h4>
        {qrCodeContent}
        <h4>{t('account.address')}</h4>
        <div className="address">
          <p>{address}</p>
        </div>
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
      </div>
    </Container>
  )
}
