import { useQuery } from 'react-query'
import { useAccountStatus, useAPI } from '../../../hooks/useAccount'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { Query } from '../../../models'

export function useQueryNft(uuid: string) {
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const { isLogined } = useAccountStatus()

  return useQuery(
    [Query.NFTDetail, uuid, api, isLogined, getAuth],
    async () => {
      const auth = isLogined ? await getAuth() : undefined
      const { data } = await api.getNFTDetail(uuid, auth)
      return data
    },
    {
      enabled: Boolean(uuid),
    }
  )
}
