import { useEffect } from 'react'

/**
 * useDidMount hook
 * Calls a function on mount
 *
 * @param {Function} callback Callback function to be called on mount
 */
export function useDidMount(callback: () => any): void {
  useEffect(() => {
    if (typeof callback === 'function') {
      callback()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
