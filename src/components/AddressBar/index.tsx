import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useRouteMatch } from 'react-router'
import styled from 'styled-components'
import { ReactComponent as QrcodeSvg } from '../../assets/svg/qrcode.svg'
import { RoutePath } from '../../routes'
import { copyFallback, generateOldAddress, truncateMiddle } from '../../utils'
import { useToast } from '../../hooks/useToast'
import { trackLabels, useTrackClick } from '../../hooks/useTrack'

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
  const toast = useToast()
  const [t] = useTranslation('translations')
  const trackCopy = useTrackClick('home', 'click')
  const matchHolder = useRouteMatch(`${RoutePath.Holder}`)
  const displayAddress = useMemo(() => {
    if (matchHolder == null) {
      return generateOldAddress(address)
    }
    return address
  }, [address, matchHolder])
  return (
    <Container className="address-bar">
      <div
        className="address"
        onClick={() => {
          copyFallback(displayAddress)
          toast(t('info.copied'))
          trackCopy(trackLabels.home.copy)
        }}
      >
        {truncateMiddle(displayAddress, 8, 5)}
      </div>
      <div
        className="qrcode"
        onClick={() => {
          history.push(RoutePath.Account + '/' + displayAddress)
          trackCopy(trackLabels.home.qrcode)
        }}
      >
        <QrcodeSvg fill="#5065E5" />
      </div>
    </Container>
  )
}
