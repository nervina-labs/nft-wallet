import { useState } from 'react'
import {
  Appbar as RowAppbar,
  AppbarButton,
  AppbarSticky,
  HEADER_HEIGHT,
} from '../../../components/Appbar'
import { ReactComponent as BackSvg } from '../../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../../assets/svg/share.svg'
import { useObservable } from 'rxjs-hooks'
import { fromEvent, tap, merge } from 'rxjs'
import { Box } from '@mibao-ui/components'
import { useHistoryBack } from '../../../hooks/useHistoryBack'

export const Appbar: React.FC = () => {
  const goBack = useHistoryBack()
  const [appbarBgOpacity, setAppbarBgOpacity] = useState(
    Math.min(window.scrollY / 400, 1)
  )

  useObservable(() =>
    merge(fromEvent(window, 'scroll'), fromEvent(window, 'touchmove')).pipe(
      tap(() => setAppbarBgOpacity(Math.min(window.scrollY / 400, 1)))
    )
  )

  return (
    <AppbarSticky>
      <RowAppbar
        transparent
        left={
          <AppbarButton onClick={goBack}>
            <BackSvg />
          </AppbarButton>
        }
        right={
          <AppbarButton transparent>
            <ShareSvg />
          </AppbarButton>
        }
      />
      <Box
        position="absolute"
        top="0"
        left="0"
        bg="white"
        h={`${HEADER_HEIGHT}px`}
        w="full"
        opacity={appbarBgOpacity}
        zIndex={-1}
      />
    </AppbarSticky>
  )
}
