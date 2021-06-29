import {
  useRef,
  DependencyList,
  MutableRefObject,
  useEffect,
  useState,
} from 'react'

interface IPosition {
  x: number
  y: number
}

interface IScrollProps {
  prevPos: IPosition
  currPos: IPosition
  startY: number | null
}

type ElementRef = MutableRefObject<HTMLElement | undefined>

const isBrowser = typeof window !== 'undefined'
const zeroPosition = { x: 0, y: 0 }

const getClientRect = (element?: HTMLElement): DOMRect | undefined =>
  element?.getBoundingClientRect()

const getScrollPosition = ({
  element,
  useWindow,
  boundingElement,
}: {
  element?: ElementRef
  boundingElement?: ElementRef
  useWindow?: boolean
}): typeof zeroPosition => {
  if (!isBrowser) {
    return zeroPosition
  }

  if (useWindow) {
    return { x: window.scrollX, y: window.scrollY }
  }

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const targetPosition = getClientRect(element?.current || document.body)
  const containerPosition = getClientRect(boundingElement?.current)

  if (!targetPosition) {
    return zeroPosition
  }

  return containerPosition
    ? {
        x: (containerPosition.x || 0) - (targetPosition.x || 0),
        y: (containerPosition.y || 0) - (targetPosition.y || 0),
      }
    : { x: targetPosition.left, y: targetPosition.top }
}

export const useScrollPosition = (
  effect: (props: IScrollProps) => void,
  deps?: DependencyList,
  element?: ElementRef,
  useWindow?: boolean,
  wait?: number,
  boundingElement?: ElementRef
): void => {
  const position = useRef(getScrollPosition({ useWindow, boundingElement }))

  let throttleTimeout: number | null = null
  const startY = useRef<null | number>(null)
  const isScrolling = useRef<NodeJS.Timeout>()

  const callBack = (): void => {
    const currPos = getScrollPosition({ element, useWindow, boundingElement })
    effect({ prevPos: position.current, currPos, startY: startY.current })
    position.current = currPos
    throttleTimeout = null
  }

  useEffect(() => {
    if (!isBrowser) {
      return undefined
    }

    const handleScroll = (): void => {
      if (wait) {
        if (throttleTimeout === null) {
          throttleTimeout = window.setTimeout(callBack, wait)
        }
      } else {
        callBack()
      }
      if (!startY.current) {
        startY.current = window.pageYOffset
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      window.clearTimeout(isScrolling.current!)

      isScrolling.current = setTimeout(() => {
        startY.current = null
      }, 66)
    }

    window.addEventListener('scroll', handleScroll, false)

    if (boundingElement) {
      boundingElement.current?.addEventListener('scroll', handleScroll, {
        passive: true,
      })
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true })
    }

    return () => {
      if (boundingElement) {
        boundingElement.current?.removeEventListener('scroll', handleScroll)
      } else {
        window.removeEventListener('scroll', handleScroll)
      }

      if (throttleTimeout) {
        clearTimeout(throttleTimeout)
      }
    }
  }, deps)
}

useScrollPosition.defaultProps = {
  deps: [],
  element: false,
  useWindow: false,
  wait: null,
  boundingElement: false,
}

export const useScrollTriggerWithThreshold = (threshold = 50): boolean => {
  const [trigger, setTrigger] = useState(false)
  useScrollPosition(({ prevPos, currPos, startY }) => {
    const isScrollUp = currPos.y > prevPos.y
    if (isScrollUp) {
      const match = startY ? -currPos.y + threshold > startY : true
      if (!match) {
        setTrigger(match)
      }
    } else {
      const match = startY ? -currPos.y - threshold > startY : false
      if (match) {
        setTrigger(match)
      }
    }
  }, [])

  return trigger
}
