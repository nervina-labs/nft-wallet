import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { scriptToAddress } from '@nervosnetwork/ckb-sdk-utils/lib/address'
import { useSetAccount, WalletType } from '../../hooks/useAccount'
import { useProfile } from '../../hooks/useProfile'
import { useRouteQuery } from '../../hooks/useRouteQuery'
import {
  FlashsignerAction,
  FlashsignerResponse,
  FlashsignerLoginData,
  FlashsignerSignData,
} from '../../models/flashsigner'
import { RoutePath } from '../../routes'
import { UnipassConfig } from '../../utils'
import { IS_MAINNET } from '../../constants'

export const Flashsigner: React.FC = () => {
  const action = useRouteQuery<FlashsignerAction>(
    'action',
    FlashsignerAction.Login
  )
  const ret = useRouteQuery('flashsigner_data', '{}')
  const res: FlashsignerResponse = JSON.parse(ret)
  const history = useHistory()
  const setFlashsignerAccount = useSetAccount()
  const { setProfile, profile } = useProfile()
  const ps = useRouteQuery('prev_state', '{}')
  const prevState = JSON.parse(ps)
  const redirectUri = useRouteQuery('redirect', '')

  useEffect(() => {
    const { code } = res
    switch (action) {
      case FlashsignerAction.Login: {
        UnipassConfig.clear()
        if (code !== 200) {
          history.replace(redirectUri || RoutePath.Login)
          break
        }
        const data = res?.result as FlashsignerLoginData
        const addr = scriptToAddress(
          {
            hashType: data.lock.hash_type,
            codeHash: data.lock.code_hash,
            args: data.lock.args,
          },
          IS_MAINNET
        )
        const pubkey = data.sig.slice(0, 520)
        setFlashsignerAccount({
          pubkey,
          address: addr,
          walletType: WalletType.Flashsigner,
        })
        setProfile(
          {
            auth: data.sig,
            message: data.message,
          },
          addr
        )
        history.replace(redirectUri || RoutePath.NFTs)
        break
      }
      case FlashsignerAction.SignTx: {
        const id = prevState.uuid as string
        if (code !== 200) {
          history.replace(`/transfer/${id}`, {
            prevState,
          })
          break
        }
        const data = res?.result as FlashsignerSignData
        history.replace(`/transfer/${id}`, {
          tx: data.tx,
          prevState,
        })
        break
      }
      default:
        break
    }
  }, [
    res,
    action,
    history,
    setProfile,
    setFlashsignerAccount,
    profile,
    prevState,
    redirectUri,
  ])
  return null
}
