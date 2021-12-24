import { lazy, Suspense, useMemo, useState } from 'react'
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
import { PosterType } from '../../../components/Share/share.interface'
import { NFTDetail } from '../../../models'
import { TokenClass } from '../../../models/class-list'
import { useShareDisclosure } from '../../../hooks/useShareDisclosure'
import { useRouteQuery } from '../../../hooks/useRouteQuery'
import { useHistory } from 'react-router'
import { RoutePath } from '../../../routes'
import { addParamsToUrl, hasTid } from '../../../utils'
import { useTranslation } from 'react-i18next'
import { useTrackClick } from '../../../hooks/useTrack'

const Share = lazy(async () => await import('../../../components/Share'))

export const Appbar: React.FC<{
  detail?: NFTDetail | TokenClass
}> = ({ detail }) => {
  const { i18n } = useTranslation('translation')
  const {
    isOpenShare,
    onOpenShare,
    onCloseShare,
    neverOpened,
  } = useShareDisclosure()
  const goBack = useHistoryBack()
  const [appbarBgOpacity, setAppbarBgOpacity] = useState(
    Math.min(window.scrollY / 400, 1)
  )

  const trackShare = useTrackClick('nft-detail', 'click')

  useObservable(() =>
    merge(fromEvent(window, 'scroll'), fromEvent(window, 'touchmove')).pipe(
      tap(() => setAppbarBgOpacity(Math.min(window.scrollY / 400, 1)))
    )
  )

  const history = useHistory()

  const isFromWechat = useRouteQuery('from_wechat', '')
  const shareBgImageUrl = useMemo(() => {
    if (!detail?.bg_image_url) return ''
    const tid = (detail as NFTDetail)?.n_token_id
    const params: { [key in string]: string } = hasTid(tid)
      ? {
          tid: `${tid}`,
          locale: i18n.language,
        }
      : {}
    return addParamsToUrl(detail?.bg_image_url, params)
  }, [detail, i18n.language])

  return (
    <>
      <AppbarSticky>
        <RowAppbar
          transparent
          left={
            <AppbarButton
              onClick={() => {
                if (isFromWechat) {
                  history.replace(RoutePath.NFTs)
                } else {
                  goBack()
                }
              }}
            >
              <BackSvg />
            </AppbarButton>
          }
          right={
            <AppbarButton
              transparent
              onClick={() => {
                onOpenShare()
                trackShare('share')
              }}
            >
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
      {detail && !neverOpened ? (
        <Suspense fallback={null}>
          <Share
            isOpen={isOpenShare}
            onClose={onCloseShare}
            shareUrl={window.location.href}
            poster={{
              type: PosterType.Nft,
              data: {
                bgImgUrl: shareBgImageUrl,
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
        </Suspense>
      ) : null}
    </>
  )
}
