import { debounceTime, fromEvent, map } from 'rxjs'
import { useObservable } from 'rxjs-hooks'

export function useInnerSize(options?: { dueTime?: number }) {
  return useObservable(
    () =>
      fromEvent(window, 'resize').pipe(
        debounceTime(options?.dueTime ?? 300),
        map(() => ({
          width: window.innerWidth,
          height: window.innerHeight,
        }))
      ),
    {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  )
}
