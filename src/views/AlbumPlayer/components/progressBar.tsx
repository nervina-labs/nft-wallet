/* eslint-disable @typescript-eslint/indent */
import { Box, BoxProps } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { fromEvent, map, switchMap, takeUntil, tap } from 'rxjs'
import { useEventCallback } from 'rxjs-hooks'

export interface ProgressBarProps extends BoxProps {
  progress: number
  progressBarMaxWidth: number
  onChangeProgress?: (progress: number) => void
}

type ProgressTouchEvent = React.TouchEvent<HTMLDivElement>

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
  const [onChangeProgressCallback] = useEventCallback<
    ProgressTouchEvent,
    number
  >(
    (event$) =>
      event$.pipe(
        switchMap(() =>
          fromEvent<ProgressTouchEvent>(window, 'touchmove', {
            passive: false,
          }).pipe(
            map((event) => {
              setIsChanging(true)
              if (event.cancelable) {
                event.stopPropagation()
                event.preventDefault()
              }
              const p = getProgressBarValue(
                event.changedTouches[0].clientX,
                progressBarMaxWidth
              )
              setCurrentProgress(p)
              return p
            }),
            takeUntil(
              fromEvent<ProgressTouchEvent>(window, 'touchend').pipe(
                tap((event) => {
                  setIsChanging(false)
                  onChangeProgress?.(
                    getProgressBarValue(
                      event.changedTouches[0].clientX,
                      progressBarMaxWidth
                    )
                  )
                })
              )
            )
          )
        )
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
    <Box w="full" h="1px" position="relative" {...props}>
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
          transform: `scaleX(${currentProgress * progressBarMaxWidth})`,
        }}
      />
      <Box
        w="6px"
        h="6px"
        top="-2px"
        left="0"
        bg="#19933B"
        position="absolute"
        rounded="full"
        transformOrigin="center center"
        onTouchStart={(e) => {
          if (e.cancelable) {
            e.preventDefault()
            e.stopPropagation()
          }
          onChangeProgressCallback(e)
        }}
        _before={{
          content: '" "',
          display: 'block',
          position: 'absolute',
          top: 'calc(50% - 25px)',
          left: 'calc(50% - 25px)',
          h: '50px',
          w: '50px',
          rounded: 'full',
        }}
        style={{
          transform: `translateX(${currentProgress * progressBarMaxWidth}px)`,
        }}
      >
        <Box
          position="absolute"
          top="0"
          left="0"
          h="6px"
          w="6px"
          rounded="full"
          bg="#19933B"
          transition="200ms"
          style={{
            transform: isChanging ? 'scale(5)' : undefined,
          }}
        />
      </Box>
    </Box>
  )
}
