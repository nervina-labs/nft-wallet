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
  const [src, setSrc] = useState(list[options?.index ?? 0] ?? '')
  const audioRef = useRef<HTMLAudioElement>(null)
  const hasNext = list.length - 1 > index

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

  const onChangeIndex = useCallback(
    (i) => {
      setWillIndex(i)
      setSrc(list[i])
      setIsPlaying(true)
      setTimeout(() => {
        onSyncAudioState()
        onPlay()
      })
    },
    [list, onPlay, onSyncAudioState]
  )

  const onNext = useCallback(() => {
    onChangeIndex(hasNext ? index + 1 : index)
  }, [hasNext, index, onChangeIndex])

  const onPrev = useCallback(() => {
    onChangeIndex(index > 0 ? index - 1 : index)
  }, [index, onChangeIndex])

  const onChangeProgress = useCallback(async (progress: number) => {
    const el = audioRef.current
    if (el) {
      if (IS_IPHONE) {
        const isPaused = el.paused
        if (!isPaused) await el.pause()
        el.currentTime = progress * el.duration
        if (!isPaused) await el.play()
      } else {
        el.currentTime = progress * el.duration
      }
    }
  }, [])

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
          if (hasNext) {
            onNext()
          } else {
            setIsPlaying(false)
          }

          options?.onEnded?.()
        }}
      />
    ),
    [hasNext, onNext, onSyncAudioState, options, src]
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
