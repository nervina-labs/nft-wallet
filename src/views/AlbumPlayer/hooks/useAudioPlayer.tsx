import { useCallback, useMemo, useRef, useState } from 'react'

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
  const [index, setIndex] = useState(options?.index || 0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const onPlay = useCallback(() => {
    const el = audioRef.current
    if (!el) return
    el.play()
  }, [])

  const hasNext = list.length - 1 > index

  const onChangeIndex = useCallback(
    (i) => {
      setIndex(i)
      setTimeout(() => onPlay())
    },
    [onPlay]
  )

  const onNext = useCallback(() => {
    onChangeIndex(hasNext ? index + 1 : index)
  }, [hasNext, index, onChangeIndex])

  const onPrev = useCallback(() => {
    onChangeIndex(index > 0 ? index - 1 : index)
  }, [index, onChangeIndex])

  const onChangeProgress = useCallback((progress: number) => {
    const el = audioRef.current
    if (el) {
      el.currentTime = progress * el.duration
    }
  }, [])

  const audioEl = useMemo(
    () => (
      <audio
        src={list[index]}
        ref={audioRef}
        onTimeUpdate={(e) => {
          const target = e.target as HTMLAudioElement
          setCurrentTime(target.currentTime)
          setDuration(target.duration)
        }}
        onPlay={() => setIsPlaying(true)}
        onPaste={() => setIsPlaying(false)}
        onEnded={(e) => {
          if (hasNext) {
            onNext()
          } else {
            setIsPlaying(false)
          }

          options?.onEnded?.()
        }}
      />
    ),
    [hasNext, index, list, onNext, options]
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
