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

function useRedirectToTarget(keyword: string) {
  const { replace } = useHistory()
  return useCallback(
    (data: SearchIssuersResponse | SearchTokenClassesResponse): boolean => {
      if (!isIssuerId(keyword) && !isTokenClassId(keyword)) {
        return false
      }
      if (
        IsIssuersResponse<SearchIssuersResponse>(data, 'issuers') &&
        data.issuers.length === 1
      ) {
        replace(`/issuer/${data.issuers[0].uuid}`)
        return true
      }
      if (
        IsIssuersResponse<SearchTokenClassesResponse>(data, 'token_classes') &&
        data.token_classes.length === 1
      ) {
        replace(`/class/${data.token_classes[0].uuid}`)
        return true
      }
      return false
    },
    [keyword, replace]
  )
}

export function useSearchAPICallback<T extends SearchType>(
  keyword: string,
  type: T
) {
  const api = useAPI()
  const tryRedirectToTarget = useRedirectToTarget(keyword)
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
  const tryRedirectToTarget = useRedirectToTarget(keyword)
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
      tryRedirectToTarget(issuersData)
      tryRedirectToTarget(tokenClassesData)
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
