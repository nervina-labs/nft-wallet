import { useMemo } from 'react'

export function useTilt(hasCardbackContent: boolean) {
  const isTouchDevice = useMemo(() => {
    return 'ontouchstart' in document.documentElement
  }, [])
  const enableGyroscope = isTouchDevice
  const shouldReverseTilt = useMemo(() => {
    if (!isTouchDevice) {
      return true
    }
    return !enableGyroscope
  }, [isTouchDevice, enableGyroscope])
  const tiltAngleYInitial = useMemo(
    () => (!isTouchDevice && !hasCardbackContent ? 15 : undefined),
    [hasCardbackContent, isTouchDevice]
  )

  return {
    shouldReverseTilt,
    enableGyroscope,
    tiltAngleYInitial,
  }
}
