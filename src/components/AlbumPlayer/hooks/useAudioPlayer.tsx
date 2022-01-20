import { useCallback, useMemo, useRef, useState, SyntheticEvent } from 'react'
import { IS_IPHONE } from '../../../constants'

export function useAudioPlayer(
  list: string[],
  options?: {
    index?: number // default is 0
    onEnded?: () => void
  }
) {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [willIndex, setWillIndex] = useState(options?.index || 0)
  const [index, setIndex] = useState(options?.index || 0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const hasNext = list.length - 1 > index

  const src = useMemo(() => list[willIndex], [list, willIndex])

  const onSyncAudioState = useCallback(
    (event?: SyntheticEvent<HTMLAudioElement>) => {
      const el = (event?.target as HTMLAudioElement) || audioRef.current
      if (!el) return
      setCurrentTime(el.currentTime)
      setDuration(el.duration)
      setIndex(willIndex)
    },
    [willIndex]
  )

  const onPlay = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    el.play()
  }, [])

  const onChangeProgress = useCallback(async (progress: number) => {
    const el = audioRef.current
    if (el) {
      const currentTime = Math.floor(progress * el.duration)
      if (IS_IPHONE) {
        const isPaused = el.paused
        if (!isPaused) await el.pause()
        el.currentTime = isNaN(currentTime) ? 0 : currentTime
        if (!isPaused) await el.play()
      } else {
        el.currentTime = isNaN(currentTime) ? 0 : currentTime
      }
    }
  }, [])

  const onChangeIndex = useCallback(
    (i: number) => {
      setWillIndex(i)
      onChangeProgress(0)
      setIsPlaying(true)
      setTimeout(() => {
        onSyncAudioState()
        onPlay()
      })
    },
    [onChangeProgress, onPlay, onSyncAudioState]
  )

  const onNext = useCallback(() => {
    onChangeIndex(hasNext ? index + 1 : 0)
  }, [hasNext, index, onChangeIndex])

  const onPrev = useCallback(() => {
    onChangeIndex(index > 0 ? index - 1 : list.length - 1)
  }, [index, list.length, onChangeIndex])

  const audioEl = useMemo(
    () => (
      <audio
        src={src}
        ref={audioRef}
        preload="metadata"
        onTimeUpdate={onSyncAudioState}
        onCanPlay={onSyncAudioState}
        onLoadedMetadata={onSyncAudioState}
        onPlay={() => setIsPlaying(true)}
        onPaste={() => setIsPlaying(false)}
        onEnded={() => {
          onNext()
          options?.onEnded?.()
        }}
      />
    ),
    [onNext, onSyncAudioState, options, src]
  )

  const onPlayToggle = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    setIsPlaying(el.paused)
    if (el.paused) {
      el.play()
    } else {
      el.pause()
    }
  }, [audioRef])

  return {
    index,
    willIndex,
    isPlaying,
    audioEl,
    onPlayToggle,
    onNext,
    onPrev,
    currentTime,
    duration,
    onChangeIndex,
    onChangeProgress,
  }
}
