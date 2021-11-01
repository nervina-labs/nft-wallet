import { useQuery } from 'react-query'
import { Query } from '../../../models'
import { useAPI } from '../../../hooks/useAccount'
import { useHistory } from 'react-router-dom'

export function useIssuerInfo(
  issuerId: string,
  options?: {
    errorRedirection?: boolean
  }
) {
  const api = useAPI()
  const { replace } = useHistory()
  const { data, isLoading, refetch, error } = useQuery(
    [Query.Issuers, api, issuerId],
    async () => {
      const { data } = await api.getIssuerInfo(issuerId)
      return data
    }
  )
  if (options?.errorRedirection !== false && error) {
    replace('/404')
  }

  return {
    data,
    isLoading,
    refetch,
    error,
  }
}
