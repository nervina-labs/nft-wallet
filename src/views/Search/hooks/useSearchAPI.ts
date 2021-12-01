import { useCallback } from 'react'
import { useQuery } from 'react-query'
import { useHistory } from 'react-router-dom'
import { useAPI } from '../../../hooks/useAccount'
import {
  Query,
  SearchType,
  SearchUuidReturn,
  SearchIssuerIdReturn,
  SearchTokenClassIdReturn,
  SearchReturn,
} from '../../../models'
import { isUuid } from '../../../utils'

function isSearchUuid<R extends SearchUuidReturn | SearchReturn>(
  data: SearchUuidReturn | SearchReturn,
  field: keyof R
): data is R {
  return field in data
}

function isSearchIssuerIdReturn<R extends SearchUuidReturn>(
  data: SearchUuidReturn,
  field: keyof R
): data is R {
  return field in data
}

function useRedirectToTarget() {
  const { push } = useHistory()
  return useCallback(
    (data: SearchUuidReturn | SearchReturn) => {
      if (
        isSearchUuid(data, 'issuer') &&
        isSearchIssuerIdReturn<SearchIssuerIdReturn>(data, 'issuer')
      ) {
        push(`/issuer/${data.issuer.uuid}`)
        return true
      }
      if (
        isSearchUuid(data, 'token_class') &&
        isSearchIssuerIdReturn<SearchTokenClassIdReturn>(data, 'token_class')
      ) {
        push(`/class/${data.token_class.uuid}`)
        return true
      }
      return false
    },
    [push]
  )
}

export function useSearchAPICallback(
  keyword: string,
  options?: { type?: SearchType }
) {
  const api = useAPI()
  const tryRedirectToTarget = useRedirectToTarget()
  const queryFn = useCallback(
    async ({ pageParam = 1 }) => {
      const isResultUuid = isUuid(keyword)
      const { data } = await api.search(keyword, {
        type: options?.type,
        page: pageParam,
        isUuid: isResultUuid,
      })
      tryRedirectToTarget(data)
      return data
    },
    [api, keyword, options?.type, tryRedirectToTarget]
  )
  return queryFn
}

export function useSearchAPI(keyword: string, options?: { type?: SearchType }) {
  const queryFn = useSearchAPICallback(keyword, options)
  return useQuery([Query.Search, keyword], queryFn, {
    enabled: !!keyword,
  })
}
