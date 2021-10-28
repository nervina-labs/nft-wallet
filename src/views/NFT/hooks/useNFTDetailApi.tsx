import { useQuery } from 'react-query'
import { useRouteMatch } from 'react-router-dom'
import { useAPI } from '../../../hooks/useAccount'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { Query } from '../../../models'
import { RoutePath } from '../../../routes'

export function useNFTDetailApi(
  uuid: string,
  options?: {
    isLogined?: boolean
  }
) {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const matchTokenClass = useRouteMatch(RoutePath.TokenClass)

  const { data: detail, failureCount, isLoading, refetch } = useQuery(
    [Query.NFTDetail, uuid, api, options?.isLogined],
    async () => {
      const auth = options?.isLogined ? await getAuth() : undefined
      if (matchTokenClass?.isExact) {
        const { data } = await api.getTokenClass(uuid, auth)
        return data
      }
      const { data } = await api.getNFTDetail(uuid, auth)
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
