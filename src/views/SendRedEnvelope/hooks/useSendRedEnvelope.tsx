import { transformers } from '@lay2/pw-core'
import { signTransactionWithRedirect } from '@nervina-labs/flashsigner'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import {
  useAccount,
  useAPI,
  useSignTransaction,
  WalletType,
} from '../../../hooks/useAccount'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { useToast } from '../../../hooks/useToast'
import { RuleType } from '../../../models'
import { UnipassAction } from '../../../models/unipass'
import { RoutePath } from '../../../routes'
import { generateUnipassUrl } from '../../../utils'
import { FormInfoState, useRouteLocation } from './useRouteLocation'

export function useSendRedEnvelope() {
  const api = useAPI()
  const routeLocation = useRouteLocation()
  const getAuth = useGetAndSetAuth()
  const { walletType, pubkey } = useAccount()
  const signTransaction = useSignTransaction()
  const { replace, push } = useHistory()
  const [isSending, setSending] = useState(false)
  const [error, setError] = useState<any>()
  const toast = useToast()
  const { t } = useTranslation('translations')

  const onSend = useCallback(
    async (formInfo: FormInfoState) => {
      setSending(true)
      setError(undefined)
      try {
        const auth = await getAuth()
        const redpackRule =
          formInfo.puzzleAnswer && formInfo.puzzleQuestion
            ? {
                rule_type: RuleType.puzzle as const,
                question: formInfo.puzzleQuestion,
                answer: formInfo.puzzleAnswer,
              }
            : undefined
        const { data } = await api.getSendRedEnvelopeTx(
          formInfo.tokenUuids,
          auth,
          walletType === WalletType.Unipass
        )
        const signTx = await signTransaction(data.tx)
        const { signature } = routeLocation.state ?? {}
        if (!signature) {
          if (walletType === WalletType.Flashsigner) {
            const url = `${location.origin}${RoutePath.Flashsigner}`
            signTransactionWithRedirect(url, {
              tx: transformers.TransformTransaction(data.tx) as any,
              extra: formInfo,
            })
            return
          }
          if (walletType === WalletType.Unipass) {
            const url = `${location.origin}${RoutePath.Unipass}`
            location.href = generateUnipassUrl(
              UnipassAction.RedEnvelope,
              url,
              url,
              pubkey,
              signTx,
              {
                ...formInfo,
                tokenUuids: formInfo.tokenUuids.join(','),
              }
            )
            return
          }
        }
        const rewardAmount = Number(formInfo.rewardAmount) ?? 1
        const uuid = await api
          .createRedEnvelopeEvent(
            formInfo.greeting,
            rewardAmount,
            data.tx,
            auth,
            {
              signature,
              redpackRule,
            }
          )
          .then((res) => res.data.uuid)
        replace(location.pathname + location.search, {})
        push(`${RoutePath.RedEnvelope}/${uuid}/share`)
        setSending(true)
      } catch (err) {
        toast(`${t('send-red-envelope.create-failed')}: ${err as string}`)
        console.error(err)
        setSending(false)
        setError(err)
      }
    },
    [
      api,
      getAuth,
      pubkey,
      push,
      replace,
      routeLocation.state,
      signTransaction,
      t,
      toast,
      walletType,
    ]
  )

  useEffect(() => {
    const { signature, prevState } = routeLocation.state ?? {}
    if (prevState && signature && !isSending && !error) {
      onSend({
        ...prevState,
        tokenUuids: prevState.tokenUuids?.split(','),
      })
    }
  }, [error, isSending, onSend, routeLocation.state])

  return { onSend, isSending, error }
}
