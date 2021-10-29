import { useQuery } from 'react-query'
import { useAPI } from '../../../hooks/useAccount'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { Query } from '../../../models'

export function useNFTDetailApi(
  uuid: string,
  options?: {
    isClass?: boolean
    isLogined?: boolean
  }
) {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()

  const { data: detail, failureCount, isLoading, refetch } = useQuery(
    [Query.NFTDetail, uuid, api, options?.isLogined],
    async () => {
      const auth = options?.isLogined ? await getAuth() : undefined
      const { data } = options?.isClass
        ? await api.getTokenClass(uuid, auth)
        : await api.getNFTDetail(uuid, auth)
      return data
    },
    { enabled: Boolean(uuid) }
  )

  return {
    detail,
    failureCount,
    isLoading,
    refetch,
  }
}
