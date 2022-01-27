import { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAPI } from '../../../hooks/useAccount'
import { useConfirmDialog } from '../../../hooks/useConfirmDialog'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { useToast } from '../../../hooks/useToast'
import { Query } from '../../../models'
import { SentCard } from './sentCard'

export const Sent: React.FC = () => {
  const { t } = useTranslation('translations')
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const toast = useToast()
  const onCloseEventDialog = useConfirmDialog()
  const queryFn = useCallback(
    async ({ pageParam = 1 }) => {
      const auth = await getAuth()
      const { data } = await api.getSentRedEnvelopeRecords(auth, {
        page: pageParam,
      })
      return data
    },
    [api, getAuth]
  )
  const [retryCount, setRetryCount] = useState(0) // Used to refresh after closing the event
  const onCloseEvent = useCallback(
    (uuid: string) => {
      onCloseEventDialog({
        title: t('red-envelope-records.close-event-confirm'),
        type: 'warning',
        async onConfirm() {
          try {
            const auth = await getAuth()
            await api.closeSentRedEnvelope(uuid, auth)
            setRetryCount((c) => c + 1)
            toast(t('red-envelope-records.toast.succeed'))
          } catch {
            toast(t('red-envelope-records.toast.failed'))
          }
        },
        onCancel() {},
      })
    },
    [api, getAuth, onCloseEventDialog, t, toast]
  )

  return (
    <InfiniteList
      enableQuery
      queryFn={queryFn}
      queryKey={[Query.GetSentRedEnvelopeRecords, retryCount]}
      noMoreElement={t('no-more')}
      calcDataLength={(data) =>
        data?.pages.reduce(
          (acc, item) => item.redpack_events.length + acc,
          0
        ) ?? 0
      }
      renderItems={(data) =>
        data.redpack_events.map((event, i) => (
          <SentCard data={event} key={i} onCloseEvent={onCloseEvent} />
        ))
      }
      style={{
        padding: '0 20px',
        marginTop: '16px',
      }}
    />
  )
}
