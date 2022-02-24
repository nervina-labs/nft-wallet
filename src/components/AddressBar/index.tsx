import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router'
import styled from 'styled-components'
import { ReactComponent as QrcodeSvg } from '../../assets/svg/qrcode.svg'
import { RoutePath } from '../../routes'
import { copyFallback, truncateMiddle } from '../../utils'
import { useToast } from '../../hooks/useToast'
import { trackLabels, useTrackClick } from '../../hooks/useTrack'
import { useAccount, WalletType } from '../../hooks/useAccount'
import {
  AddressPrefix,
  addressToScript,
  fullPayloadToAddress,
  AddressType,
} from '@nervosnetwork/ckb-sdk-utils'
import { IS_MAINNET } from '../../constants'

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
  const { walletType } = useAccount()
  const displayAddress = useMemo(() => {
    if (walletType === WalletType.Flashsigner) {
      return address
    }
    const script = addressToScript(address)
    return fullPayloadToAddress({
      args: script.args,
      type:
        script.hashType === 'data'
          ? AddressType.DataCodeHash
          : AddressType.TypeCodeHash,
      codeHash: script.codeHash,
      prefix: IS_MAINNET ? AddressPrefix.Mainnet : AddressPrefix.Testnet,
    })
  }, [walletType, address])
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
