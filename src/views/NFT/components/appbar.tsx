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
import { Box, useDisclosure } from '@mibao-ui/components'
import { useHistoryBack } from '../../../hooks/useHistoryBack'
import { PosterType, Share } from '../../../components/Share/next'
import { NFTDetail } from '../../../models'
import { TokenClass } from '../../../models/class-list'

export const Appbar: React.FC<{
  detail?: NFTDetail | TokenClass
}> = ({ detail }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
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
    <>
      <AppbarSticky>
        <RowAppbar
          transparent
          left={
            <AppbarButton onClick={goBack}>
              <BackSvg />
            </AppbarButton>
          }
          right={
            <AppbarButton transparent onClick={onOpen}>
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
      <Share
        isOpen={isOpen}
        onClose={onClose}
        shareUrl={window.location.href}
        poster={{
          type: PosterType.Nft,
          data: {
            bgImgUrl: detail?.bg_image_url ?? '',
            name: detail?.name ?? '',
            limited: {
              count: Number(detail?.total) ?? 0,
              serialNumber: (detail as NFTDetail)?.n_token_id,
            },
            issuer: {
              name: detail?.issuer_info?.name ?? '',
              avatarUrl: detail?.issuer_info?.avatar_url ?? '',
              isVerified: detail?.verified_info?.is_verified === true,
            },
          },
        }}
      />
    </>
  )
}
