import { useHistory } from 'react-router-dom'
import { useCallback } from 'react'
import { useRoute } from './useRoute'

export function useHistoryBack() {
  const history = useHistory()
  const { from, to } = useRoute()
  return useCallback(() => {
    if (from === to) {
      history.replace('/')
      return
    }
    history.goBack()
  }, [from, history, to])
}
