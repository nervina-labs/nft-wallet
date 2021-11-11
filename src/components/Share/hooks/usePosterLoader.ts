import { useEffect } from 'react'

export function usePosterLoader<E extends HTMLDivElement>(
  posterElement: E | null,
  onLoad: (el: E) => void,
  loading = true
) {
  useEffect(() => {
    if (posterElement && !loading) {
      onLoad(posterElement)
    }
  }, [onLoad, posterElement, loading])
}
