import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
  AppbarSticky,
  Appbar as RowAppbar,
  AppbarButton,
} from '../../../components/Appbar'
import { PosterType } from '../../../components/Share/share.interface'
import { useHistoryBack } from '../../../hooks/useHistoryBack'
import { formatCount, getImagePreviewUrl } from '../../../utils'
import { ReactComponent as BackSvg } from '../../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../../assets/svg/share.svg'
import { useIssuerInfo } from '../hooks/useIssuerInfo'
import { lazy, Suspense } from 'react'
import { Query } from '../../../models'
import { useAPI } from '../../../hooks/useAccount'
import { useQuery } from 'react-query'
import { useShareDisclosure } from '../../../hooks/useShareDisclosure'
import { useObservable } from 'rxjs-hooks'
import { fromEvent, map, merge } from 'rxjs'

const Share = lazy(async () => await import('../../../components/Share'))

export const Appbar: React.FC = () => {
  const goBack = useHistoryBack()
  const { i18n } = useTranslation('translations')
  const {
    isOpenShare,
    onOpenShare,
    onCloseShare,
    neverOpened,
  } = useShareDisclosure()
  const { id } = useParams<{ id: string }>()
  const api = useAPI()
  const { data: infoData } = useIssuerInfo(id)
  const { data: listData } = useQuery(
    [Query.Issuers, api, id, 'product_state'],
    async () => {
      const { data } = await api.getIssuerTokenClass(id, 'product_state', {
        page: 1,
      })
      return { pages: [data] }
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )
  const appbarBgOpacity = useObservable(
    () =>
      merge(fromEvent(window, 'scroll'), fromEvent(window, 'touchmove')).pipe(
        map(() => Math.min(window.scrollY / 150, 1))
      ),
    Math.min(window.scrollY / 150, 1)
  )
  const bgImageUrl = listData?.pages?.[0]?.token_classes?.[0]?.bg_image_url
  const posterCoverImage = bgImageUrl ? getImagePreviewUrl(bgImageUrl, 300) : ''

  return (
    <>
      <AppbarSticky
        position="fixed"
        bg={`rgba(255, 255, 255, ${appbarBgOpacity})`}
      >
        <RowAppbar
          transparent
          left={
            <AppbarButton onClick={goBack}>
              <BackSvg />
            </AppbarButton>
          }
          right={
            <AppbarButton transparent onClick={onOpenShare}>
              <ShareSvg />
            </AppbarButton>
          }
        />
      </AppbarSticky>
      {infoData && listData && !neverOpened ? (
        <Suspense fallback={null}>
          <Share
            isOpen={isOpenShare}
            onClose={onCloseShare}
            shareUrl={window.location.href}
            poster={{
              type: PosterType.Issuer,
              data: {
                username: infoData.name,
                avatarUrl: infoData.avatar_url ?? '',
                isVerified: infoData.verified_info?.is_verified,
                verifiedTitle: infoData.verified_info?.verified_title,
                desc: infoData.description ?? '',
                follow: formatCount(infoData.issuer_follows, i18n.language),
                like: formatCount(infoData.issuer_likes, i18n.language),
                coverImage: posterCoverImage,
              },
            }}
          />
        </Suspense>
      ) : null}
    </>
  )
}
