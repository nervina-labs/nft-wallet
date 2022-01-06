/* eslint-disable @typescript-eslint/indent */
import {
  AppbarSticky,
  Appbar as RowAppbar,
  AppbarButton,
} from '../../../components/Appbar'
import { useHistoryBack } from '../../../hooks/useHistoryBack'
import { ReactComponent as BackSvg } from '../../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../../assets/svg/share.svg'
import { AvatarType, UserResponse } from '../../../models/user'
import { PosterType } from '../../../components/Share/share.interface'
import { DrawerMenu } from '../DrawerMenu'
import { ReactComponent as SettingsSvg } from '../../../assets/svg/settings.svg'
import { useTranslation } from 'react-i18next'
import { addParamsToUrl, getImagePreviewUrl } from '../../../utils'
import { lazy, Suspense } from 'react'
import { useQuery } from 'react-query'
import { Query } from '../../../models'
import { useAPI } from '../../../hooks/useAccount'
import { useShareDisclosure } from '../../../hooks/useShareDisclosure'
import { useDisclosure } from '@chakra-ui/react'
import { trackLabels, useTrackClick } from '../../../hooks/useTrack'

const Share = lazy(async () => await import('../../../components/Share'))

export const Appbar: React.FC<{
  user?: UserResponse
  isHolder?: boolean
  address?: string
}> = ({ user, isHolder, address }) => {
  const api = useAPI()
  const { t, i18n } = useTranslation('translations')
  const goBack = useHistoryBack()
  const urlParams = {
    tid: `${user?.avatar_tid ?? ''}`,
    locale: i18n.language,
  }
  const {
    isOpenShare,
    onOpenShare,
    onCloseShare,
    neverOpened,
  } = useShareDisclosure()
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure()
  const shareAvatarUrl =
    user?.avatar_type === AvatarType.Token && user?.avatar_url
      ? addParamsToUrl(user?.avatar_url, urlParams)
      : user?.avatar_url

  const { data } = useQuery(
    [Query.NFTList, address, 'owned'],
    async () => {
      const options: Record<string, any> = {
        address,
      }
      if (isHolder) {
        options.exclude_banned = true
      }
      const { data } = await api.getNFTs(1, options)
      return { pages: [data] }
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
    }
  )

  const classBgImageUrl = data?.pages?.[0]?.token_list?.[0]?.class_bg_image_url

  const posterCoverImage = classBgImageUrl
    ? addParamsToUrl(getImagePreviewUrl(classBgImageUrl, 600), {
        tid: `${data?.pages?.[0]?.token_list?.[0].n_token_id}`,
        locale: i18n.language,
      })
    : ''

  const trackSetting = useTrackClick('home', 'click')
  return (
    <>
      <AppbarSticky position={isHolder ? 'sticky' : 'relative'}>
        <RowAppbar
          left={
            <AppbarButton
              onClick={isHolder ? goBack : openDrawer}
              className={isHolder ? '' : 'setting'}
            >
              {isHolder ? (
                <BackSvg />
              ) : (
                <SettingsSvg
                  onClick={() => {
                    trackSetting(trackLabels.home.settings)
                  }}
                />
              )}
            </AppbarButton>
          }
          right={
            <AppbarButton transparent onClick={onOpenShare}>
              <ShareSvg />
            </AppbarButton>
          }
        />
      </AppbarSticky>
      <DrawerMenu close={closeDrawer} isDrawerOpen={isDrawerOpen} />
      {user && !neverOpened ? (
        <Suspense fallback={null}>
          <Share
            isOpen={isOpenShare}
            onClose={onCloseShare}
            shareUrl={`${window.location.origin}/holder/${address ?? ''}`}
            poster={{
              type: PosterType.Holder,
              data: {
                username: user.nickname ?? t('holder.user-name-empty'),
                avatarUrl: shareAvatarUrl ?? '',
                collectionCount: data?.pages?.[0]?.meta?.total_count ?? 0,
                desc: user.description,
                coverImage: posterCoverImage,
                isNftAvatar: user.avatar_type === AvatarType.Token,
                isHolder,
              },
            }}
          />
        </Suspense>
      ) : null}
    </>
  )
}
