import { transformers } from '@lay2/pw-core'
import {
  appendSignatureToTransaction,
  signMessageWithRedirect,
  transactionToMessage,
} from '@nervina-labs/flashsigner'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import UP from 'up-core-test'
import {
  useAccount,
  useAPI,
  useSignTransaction,
  WalletType,
} from '../../../hooks/useAccount'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { useToast } from '../../../hooks/useToast'
import { RuleType, UnsignedTransactionSendRedEnvelope } from '../../../models'
import { FlashsignerAction } from '../../../models/flashsigner'
import { RoutePath } from '../../../routes'
import { FormInfoState, useRouteLocation } from './useRouteLocation'

const METAMASK_USER_DENIED_MESSAGE_SIGNATURE_CODE = 4001

export function useSendRedEnvelope() {
  const api = useAPI()
  const routeLocation = useRouteLocation()
  const getAuth = useGetAndSetAuth()
  const { walletType } = useAccount()
  const signTransaction = useSignTransaction()
  const { replace, push } = useHistory()
  const [isSending, setSending] = useState(false)
  const [error, setError] = useState<any>()
  const toast = useToast()
  const { t, i18n } = useTranslation('translations')

  const getSignTx = useCallback(
    async (data: UnsignedTransactionSendRedEnvelope) => {
      const { signature } = routeLocation.state ?? {}
      if (walletType === WalletType.Flashsigner) {
        return appendSignatureToTransaction(
          data.unsigned_tx,
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          signature!
        )
      }
      return await signTransaction(data.tx)
    },
    [routeLocation.state, signTransaction, walletType]
  )

  const onSend = useCallback(
    async (formInfo: FormInfoState) => {
      if (walletType === WalletType.Unipass) {
        UP.initPop()
      }
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
          walletType
        )
        const { signature } = routeLocation.state ?? {}
        const signTx = await getSignTx(data)
        if (!signature && walletType === WalletType.Flashsigner) {
          const url = `${location.origin}${RoutePath.Flashsigner}`
          signMessageWithRedirect(url, {
            isRaw: false,
            message: transactionToMessage(
              transformers.TransformTransaction(data.tx) as any
            ),
            extra: {
              action: FlashsignerAction.SendRedEnvelope,
              prevState: {
                ...formInfo,
                tokenUuids: formInfo.tokenUuids.join(','),
              },
            },
            isReplace: true as any,
            locale: i18n.language,
            failUrl: location.href,
          })
          return
        }

        const rewardAmount = Number(formInfo.rewardAmount) ?? 1
        const uuid = await api
          .createRedEnvelopeEvent(
            formInfo.greeting ||
              t('send-red-envelope.form-items.greeting-placeholder'),
            rewardAmount,
            signTx,
            auth,
            {
              signature:
                walletType === WalletType.Flashsigner ? undefined : signature,
              redpackRule,
            }
          )
          .then((res) => res.data.uuid)
        replace(location.pathname + location.search, {})
        push(`${RoutePath.RedEnvelope}/${uuid}/share`)
        setSending(true)
      } catch (err) {
        console.error(err)
        setSending(false)
        setError(err)
        replace(location.pathname + location.search, {})
        if (
          (err as any)?.code === METAMASK_USER_DENIED_MESSAGE_SIGNATURE_CODE
        ) {
          return
        }
        toast(`${t('send-red-envelope.create-failed')}: ${err as string}`)
      }
    },
    [
      api,
      getAuth,
      getSignTx,
      push,
      replace,
      routeLocation.state,
      t,
      toast,
      walletType,
      i18n.language,
    ]
  )

  useEffect(() => {
    const { signature, prevState, tx } = routeLocation.state ?? {}
    if (prevState && (signature || tx) && !isSending && !error) {
      onSend({
        ...prevState,
        tokenUuids: Array.isArray(prevState.tokenUuids)
          ? prevState.tokenUuids
          : prevState.tokenUuids.split(','),
      })
    }
  }, [error, isSending, onSend, routeLocation.state])

  return { onSend, isSending, error }
}
