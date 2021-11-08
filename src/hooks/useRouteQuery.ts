import { useCallback, useMemo } from 'react'
import { useHistory, useLocation } from 'react-router-dom'

export function useRouteQuery<T extends string>(
  name: string,
  defaultVal: T
): T {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  return (query.get(name) as T) ?? defaultVal
}

export function useRouteQuerySearch<T extends string>(
  name: string,
  defaultVal: T
): [T, (v: T) => void] {
  const { location, replace } = useHistory()
  const query = useMemo(() => new URLSearchParams(location.search), [
    location.search,
  ])
  const onUpdate = useCallback(
    (value: T) => {
      query.set(name, value)
      replace(`${location.pathname}?${query.toString()}`)
    },
    [location.pathname, name, query, replace]
  )
  return [(query.get(name) as T) ?? defaultVal, onUpdate]
}
