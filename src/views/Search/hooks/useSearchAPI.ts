import { useCallback } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import { useAPI } from '../../../hooks/useAccount'
import {
  Query,
  SearchIssuersResponse,
  SearchTokenClassesResponse,
  SearchType,
} from '../../../models'
import { isIssuerId, isTokenClassId } from '../../../utils'

const NO_TYPE_LIMIT = 3

function IsIssuersResponse<
  D extends SearchIssuersResponse | SearchTokenClassesResponse
>(
  data: SearchIssuersResponse | SearchTokenClassesResponse,
  field: keyof D
): data is D {
  return field in data
}

function useRedirectToTarget<T extends SearchType>(keyword: string, type: T) {
  const { push } = useHistory()
  return useCallback(
    (data: SearchIssuersResponse | SearchTokenClassesResponse) => {
      if (!isIssuerId(keyword) && !isTokenClassId(keyword)) {
        return false
      }
      if (IsIssuersResponse<SearchIssuersResponse>(data, 'issuers')) {
        push(`/issuer/${data.issuers[0].uuid}`)
        return true
      }
      if (
        IsIssuersResponse<SearchTokenClassesResponse>(data, 'token_classes')
      ) {
        push(`/class/${data.token_classes[0].uuid}`)
        return true
      }
      return false
    },
    [keyword, push]
  )
}

export function useSearchAPICallback<T extends SearchType>(
  keyword: string,
  type: T
) {
  const api = useAPI()
  const tryRedirectToTarget = useRedirectToTarget(keyword, type)
  const queryFn = useCallback(
    async ({ pageParam = 1 }) => {
      const { data } = await api.search(keyword, type, {
        page: pageParam,
      })
      tryRedirectToTarget(data)
      return data
    },
    [api, keyword, tryRedirectToTarget, type]
  )
  return queryFn
}

export function useNoTypeSearchAPI(keyword: string) {
  const api = useAPI()
  return useQuery(
    [Query.Search, keyword],
    async () => {
      const { data: issuersData } = await api.search(
        keyword,
        SearchType.Issuer,
        {
          limit: NO_TYPE_LIMIT,
        }
      )
      const { data: tokenClassesData } = await api.search(
        keyword,
        SearchType.TokenClass,
        {
          limit: NO_TYPE_LIMIT,
        }
      )
      return {
        issuersData,
        tokenClassesData,
      }
    },
    {
      enabled: !!keyword,
    }
  )
}
