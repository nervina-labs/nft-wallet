import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { ReactComponent as QrcodeSvg } from '../../assets/svg/qrcode.svg'
import { useSnackbar } from '../../hooks/useSnackbar'
import { RoutePath } from '../../routes'
import { copyFallback, truncateMiddle } from '../../utils'

const Container = styled.div`
  height: 32px;
  display: flex;
  border-radius: 21px;
  width: 180px;
  display: flex;
  background-color: #f6f8fa;
  overflow: hidden;
  .address {
    flex: 1;
    margin-left: 16px;
    display: flex;
    align-items: center;
    font-size: 14px;
    cursor: pointer;
    color: black;
    background-color: #f6f8fa;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }
  .qrcode {
    margin-left: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background-color: #f6f8fa;
    margin-right: 16px;
  }
`

export interface AddressbarProps {
  address: string
  isHolder?: boolean
}

export const Addressbar: React.FC<AddressbarProps> = ({
  address,
  isHolder,
}) => {
  const history = useHistory()
  const { snackbar } = useSnackbar()
  const [t] = useTranslation('translations')
  return (
    <Container className="address-bar">
      <div
        className="address"
        onClick={() => {
          copyFallback(address)
          snackbar(t('info.copied'))
        }}
      >
        {truncateMiddle(address, 8, 5)}
      </div>
      <div
        className="qrcode"
        onClick={() => {
          history.push(RoutePath.Account + '/' + address)
        }}
      >
        <QrcodeSvg fill="#5065E5" />
      </div>
    </Container>
  )
}
