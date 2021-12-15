import { useRouteQuerySearch } from '../../../hooks/useRouteQuery'
import { SearchType } from '../../../models'

export function useType() {
  return useRouteQuerySearch<SearchType | ''>('type', '')
}
