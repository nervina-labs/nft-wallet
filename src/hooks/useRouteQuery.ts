import { useLocation } from 'react-router-dom'

export const useRouteQuery = (name: string, defaultVal: string): string => {
  const location = useLocation()
  const query = new URLSearchParams(location.search)
  return query.get(name) ?? defaultVal
}
