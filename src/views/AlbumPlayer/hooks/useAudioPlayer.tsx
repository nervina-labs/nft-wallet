import { useCallback, useMemo, useRef, useState } from 'react'

export function useAudioPlayer(
  list: string[],
  options?: {
    index: number // default is 0
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

  const onNext = useCallback(() => {
    setIndex((i) => (hasNext ? i + 1 : i))
    setTimeout(() => onPlay())
  }, [hasNext, onPlay])

  const onPrev = useCallback(() => {
    setIndex((i) => (i > 0 ? i - 1 : i))
    setTimeout(() => onPlay())
  }, [onPlay])

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
        }}
      />
    ),
    [hasNext, index, list, onNext]
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
  }
}
