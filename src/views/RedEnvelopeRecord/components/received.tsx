import { useCallback } from 'react'
import { InfiniteList } from '../../../components/InfiniteList'
import { useAPI } from '../../../hooks/useAccount'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { Query } from '../../../models'
import { ReceivedCard } from './receivedCard'

export const Received: React.FC = () => {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const queryFn = useCallback(
    async ({ pageParam = 1 }) => {
      const auth = await getAuth()
      const { data } = await api.getReceivedRedEnvelopeRecords(auth, {
        page: pageParam,
      })
      return data
    },
    [api, getAuth]
  )
  return (
    <InfiniteList
      enableQuery
      queryFn={queryFn}
      queryKey={[Query.GetReceivedRedEnvelopeRecords, api]}
      noMoreElement={''}
      calcDataLength={(data) =>
        data?.pages.reduce((acc, item) => item.records.length + acc, 0) ?? 0
      }
      renderItems={(data) =>
        data.records.map((record, i) => <ReceivedCard data={record} key={i} />)
      }
      queryOptions={{
        cacheTime: 0,
      }}
      style={{
        padding: '0 20px',
        marginTop: '16px',
      }}
    />
  )
}
