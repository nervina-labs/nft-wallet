import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { ReactComponent as QrcodeSvg } from '../../assets/svg/qrcode.svg'
import { useProfileModel } from '../../hooks/useProfile'
import { RoutePath } from '../../routes'
import { copyFallback, truncateMiddle } from '../../utils'

const Container = styled.div`
  height: 33px;
  display: flex;
  box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  width: 100%;
  display: flex;
  background-color: white;
  overflow: hidden;
  .address {
    flex: 1;
    margin-left: 16px;
    display: flex;
    align-items: center;
    font-size: 12px;
    cursor: pointer;
    color: black;
    background-color: white;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }
  .qrcode {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 65px;
    background: #f9f5f2;
    cursor: pointer;
    border-top-left-radius: 16px;
  }
`

export interface AddressbarProps {
  address: string
}

export const Addressbar: React.FC<AddressbarProps> = ({ address }) => {
  const history = useHistory()
  const { snackbar } = useProfileModel()
  const [t] = useTranslation('translations')
  return (
    <Container>
      <div
        className="address"
        onClick={() => {
          copyFallback(address)
          snackbar(t('info.copied'))
        }}
      >
        {truncateMiddle(address, 24, 12)}
      </div>
      <div className="qrcode" onClick={() => history.push(RoutePath.Info)}>
        <QrcodeSvg />
      </div>
    </Container>
  )
}
