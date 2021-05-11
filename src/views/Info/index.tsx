import React, { useMemo } from 'react'
import styled from 'styled-components'
import QRCode from 'qrcode.react'
import { Copyzone } from '../../components/Copyzone'
import { truncateMiddle } from '../../utils'
import { useWalletModel } from '../../hooks/useWallet'
import { useTranslation } from 'react-i18next'

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
    color: rgba(0, 0, 0, 0.6);
    margin-top: 0;
    margin-bottom: 16px;
  }
  .qr-code {
    width: 200px;
    height: 200px;
    margin-bottom: 16px;
  }
`

export const Info: React.FC = () => {
  const { address } = useWalletModel()
  const { t } = useTranslation('translations')
  const qrCodeContent = useMemo(
    () => (
      <>
        <QRCode
          style={{ width: '200px', height: '200px' }}
          className="qr-code"
          value={address}
        />
        <Copyzone displayText={truncateMiddle(address, 10, 6)} text={address} />
      </>
    ),
    [address]
  )
  return (
    <Container>
      <h3 className="title">{t('info.title')}</h3>
      {qrCodeContent}
    </Container>
  )
}
