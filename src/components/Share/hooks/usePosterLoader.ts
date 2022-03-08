import { useEffect } from 'react'

export function usePosterLoader<E extends HTMLDivElement>(
  ref: React.RefObject<E>,
  onLoad: (el: E) => void,
  loading = true
) {
  useEffect(() => {
    if (ref.current && !loading) {
      onLoad(ref.current)
    }
  }, [onLoad, ref, loading])
}
