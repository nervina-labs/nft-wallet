/* eslint-disable @typescript-eslint/indent */
import { Box, BoxProps } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { fromEvent, map, switchMap, takeUntil, tap } from 'rxjs'
import { useEventCallback } from 'rxjs-hooks'
import { CONTAINER_MAX_WIDTH } from '../../../constants'

export interface ProgressBarProps extends BoxProps {
  progress: number
  progressBarMaxWidth: number
  onChangeProgress?: (progress: number) => void
}

type ProgressTouchEvent = React.TouchEvent<HTMLDivElement>
type ProgressMouseEvent = React.MouseEvent<HTMLDivElement>

function getProgressBarValue(x: number, width: number) {
  return Math.min(x <= 0 ? 0 : x, width) / width
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  onChangeProgress,
  progressBarMaxWidth,
  ...props
}) => {
  const [isChanging, setIsChanging] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(progress)
  const onChangeCurrentProgress = (x: number) => {
    const offsetX = Math.max((window.innerWidth - CONTAINER_MAX_WIDTH) / 2, 0)
    const w = Math.min(window.innerWidth, CONTAINER_MAX_WIDTH)
    const p = getProgressBarValue(x - offsetX, w)
    setCurrentProgress(p)
    return p
  }

  const [onChangeProgressByTouchstart] = useEventCallback<
    ProgressTouchEvent,
    number
  >(
    (event$) =>
      event$.pipe(
        switchMap((touchStartEvent) => {
          setIsChanging(true)
          onChangeCurrentProgress(touchStartEvent.changedTouches[0].clientX)
          return fromEvent<ProgressTouchEvent>(window, 'touchmove', {
            passive: false,
          }).pipe(
            map((event) => {
              if (event.cancelable) {
                event.stopPropagation()
                event.preventDefault()
              }
              return onChangeCurrentProgress(event.changedTouches[0].clientX)
            }),
            takeUntil(
              fromEvent<ProgressTouchEvent>(window, 'touchend').pipe(
                tap((event) => {
                  setIsChanging(false)
                  onChangeProgress?.(
                    onChangeCurrentProgress(event.changedTouches[0].clientX)
                  )
                })
              )
            )
          )
        })
      ),
    progress
  )

  const [onChangeProgressByMouseDown] = useEventCallback<
    ProgressMouseEvent,
    number
  >(
    ($event) =>
      $event.pipe(
        switchMap((mouseDownEvent) => {
          setIsChanging(true)
          onChangeCurrentProgress(mouseDownEvent.clientX)
          return fromEvent<ProgressMouseEvent>(window, 'mousemove').pipe(
            map((event) => {
              return onChangeCurrentProgress(event.clientX)
            }),
            takeUntil(
              fromEvent<ProgressMouseEvent>(window, 'mouseup').pipe(
                tap((event) => {
                  setIsChanging(false)
                  onChangeProgress?.(onChangeCurrentProgress(event.clientX))
                })
              )
            )
          )
        })
      ),
    progress
  )

  useEffect(() => {
    if (progress && !isChanging) {
      setCurrentProgress(progress)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress])

  return (
    <Box
      w="full"
      h="1px"
      position="relative"
      {...props}
      _before={{
        content: '" "',
        display: 'block',
        position: 'absolute',
        top: 'calc(50% - 15px)',
        left: '0',
        h: '30px',
        w: 'full',
        rounded: 'full',
        cursor: 'pointer',
      }}
      onMouseDown={onChangeProgressByMouseDown}
      onTouchStart={(e) => {
        if (e.cancelable) {
          e.preventDefault()
          e.stopPropagation()
        }
        onChangeProgressByTouchstart(e)
      }}
    >
      <Box
        zIndex={0}
        bg="#777E90"
        position="absolute"
        top="0"
        left="0"
        w="full"
        h="full"
      />
      <Box
        w="1px"
        h="full"
        bg="#19933B"
        transformOrigin="top left"
        zIndex={1}
        position="absolute"
        top="0"
        left="0"
        style={{
          transition: isChanging ? '0ms' : '100ms',
          transform: `scaleX(${currentProgress * progressBarMaxWidth})`,
        }}
      />
      <Box
        w="6px"
        h="6px"
        top="-2px"
        left="0"
        position="absolute"
        transformOrigin="center center"
        style={{
          transition: isChanging ? '0ms' : '50ms',
          transform: `translateX(${currentProgress * progressBarMaxWidth}px)`,
        }}
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          h="full"
          w="full"
          rounded="full"
          bg="#19933B"
          transition="200ms"
          cursor="pointer"
          style={{
            transform: isChanging ? 'scale(5)' : undefined,
          }}
        />
      </Box>
    </Box>
  )
}
