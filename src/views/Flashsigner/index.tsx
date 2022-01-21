import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSetAccount, WalletType } from '../../hooks/useAccount'
import { useProfile } from '../../hooks/useProfile'
import { RoutePath } from '../../routes'
import { UnipassConfig } from '../../utils'
import { getResultFromURL, FlashsignerAction } from '@nervina-labs/flashsigner'

export const Flashsigner: React.FC = () => {
  const history = useHistory()
  const setFlashsignerAccount = useSetAccount()
  const { setProfile, profile } = useProfile()

  useEffect(() => {
    getResultFromURL<any>({
      onLogin(res) {
        UnipassConfig.clear()
        const { address, pubkey, signature, message, extra } = res
        setFlashsignerAccount({
          pubkey,
          address: address,
          walletType: WalletType.Flashsigner,
        })
        setProfile(
          {
            auth: signature,
            message: message,
          },
          address
        )
        history.replace(extra?.redirect || RoutePath.NFTs)
      },
      onSignTransaction(result) {
        const { transaction } = result
        const { uuid } = result.extra
        const state: Record<string, any> = {
          tx: transaction,
          customData: result.extra?.customData,
        }
        history.replace(`${RoutePath.RedeemResult}/${uuid as string}`, state)
      },
      onTransferMnft(res) {
        history.replace(`/transfer/${res.extra?.uuid as string}`, {
          tx: res.transaction,
          prevState: res.extra,
        })
      },
      onError(_, action, extra) {
        if (action === FlashsignerAction.TransferMnft) {
          history.replace(`/transfer/${extra?.uuid as string}`)
        } else if (action === FlashsignerAction.SignTransaction) {
          history.replace(extra?.prevPath || RoutePath.NFTs)
        } else {
          history.replace(extra?.redirect || RoutePath.NFTs)
        }
      },
    })
  }, [history, setProfile, setFlashsignerAccount, profile])
  return null
}
