import React, { useState, useCallback, useEffect, useMemo } from 'react'

export function useWidth(
  elementRef: React.RefObject<HTMLElement> | HTMLElement
): number | undefined {
  const [width, setWidth] = useState<number>()

  const element = useMemo(() => {
    return elementRef instanceof HTMLElement ? elementRef : elementRef.current
  }, [elementRef])

  const updateWidth = useCallback(() => {
    if (element != null) {
      const { width } = element.getBoundingClientRect()
      setWidth(width)
    }
  }, [element])

  useEffect(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
    return () => {
      window.removeEventListener('resize', updateWidth)
    }
  }, [updateWidth])

  return width
}
