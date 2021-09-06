import { useMemo } from 'react'
import { DAS_INDEXER_URL } from '../constants/env'
import Das from 'das-sdk'

export const useDas: (url?: string) => Das = (url = DAS_INDEXER_URL) => {
  const das = useMemo(() => {
    return new Das({
      url,
    })
  }, [url])
  return das
}
