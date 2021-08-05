import { useLocation } from 'react-router-dom'

export function useRouteQuery<T extends string>(
  name: string,
  defaultVal: T
): T {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  return (query.get(name) as T) ?? defaultVal
}
