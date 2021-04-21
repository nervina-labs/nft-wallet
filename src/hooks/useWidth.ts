import React, { useState, useCallback, useEffect } from 'react'

export function useWidth(
  elementRef: React.RefObject<HTMLElement>
): number | undefined {
  const [width, setWidth] = useState<number>()

  const updateWidth = useCallback(() => {
    if (elementRef?.current != null) {
      const { width } = elementRef.current.getBoundingClientRect()
      setWidth(width)
    }
  }, [elementRef])

  useEffect(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => {
      window.removeEventListener('resize', updateWidth)
    }
  }, [updateWidth])

  return width
}
