import { useQuery } from 'react-query'
import { useAccountStatus, useAPI } from '../../../hooks/useAccount'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { Query } from '../../../models'

export function useNFTDetailApi(
  uuid: string,
  options?: {
    isClass?: boolean
  }
) {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const { isLogined } = useAccountStatus()

  const { data: detail, failureCount, isLoading, refetch } = useQuery(
    [Query.NFTDetail, uuid, api, isLogined],
    async () => {
      const auth = isLogined ? await getAuth() : undefined
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
