import { useHistory } from 'react-router-dom'
import { useCallback } from 'react'
import { useRoute } from './useRoute'
import { RoutePath } from '../routes'

export function useHistoryBack() {
  const history = useHistory()
  const { from, to } = useRoute()
  return useCallback(() => {
    if (from === to) {
      history.replace('/')
      return
    } else if (from.startsWith(RoutePath.Flashsigner)) {
      history.go(-2)
      return
    }
    history.goBack()
  }, [from, history, to])
}
