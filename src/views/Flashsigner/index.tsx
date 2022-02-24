import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useSetAccount, WalletType } from '../../hooks/useAccount'
import { useProfile } from '../../hooks/useProfile'
import { RoutePath } from '../../routes'
import { UnipassConfig } from '../../utils'
import { getResultFromURL, FlashsignerAction } from '@nervina-labs/flashsigner'
import { FlashsignerAction as LocalFlashsignerAction } from '../../models/flashsigner'

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
      onSignMessage(result) {
        const action = result.extra?.action as LocalFlashsignerAction
        if (action === LocalFlashsignerAction.SendRedEnvelope) {
          history.replace(`${RoutePath.RedEnvelope}`, {
            signature: result.signature,
            ...result.extra,
          })
        } else if (action === LocalFlashsignerAction.Redeem) {
          const { uuid } = result.extra
          const state: Record<string, any> = {
            signature: result.signature,
            customData: result.extra?.customData,
          }
          history.replace(`${RoutePath.RedeemResult}/${uuid as string}`, state)
        }
      },
      onSignTransaction(result) {
        const action = result.extra?.action as LocalFlashsignerAction
        const { transaction } = result
        switch (action) {
          case LocalFlashsignerAction.SendRedEnvelope: {
            history.replace(`${RoutePath.RedEnvelope}`, {
              tx: transaction,
              prevState: result.extra,
            })
            break
          }
          case LocalFlashsignerAction.Redeem:
          default: {
            const { uuid } = result.extra
            const state: Record<string, any> = {
              tx: transaction,
              customData: result.extra?.customData,
            }
            history.replace(
              `${RoutePath.RedeemResult}/${uuid as string}`,
              state
            )
            break
          }
        }
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
