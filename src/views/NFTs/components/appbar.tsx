import { useDisclosure } from '@chakra-ui/react'
import {
  AppbarSticky,
  Appbar as RowAppbar,
  AppbarButton,
} from '../../../components/Appbar'
import { useHistoryBack } from '../../../hooks/useHistoryBack'
import { ReactComponent as BackSvg } from '../../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../../assets/svg/share.svg'
import { UserResponse } from '../../../models/user'
import { PosterType, Share } from '../../../components/Share/next'
import { DrawerMenu } from '../DrawerMenu'
import { ReactComponent as SettingsSvg } from '../../../assets/svg/settings.svg'
import { useShareListInfo } from '../hooks/useShareListInfo'

export const Appbar: React.FC<{
  user?: UserResponse
  isHolder?: boolean
  address?: string
}> = ({ user, isHolder, address }) => {
  const goBack = useHistoryBack()
  const {
    isOpen: isOpenShare,
    onOpen: onOpenShare,
    onClose: onCloseShare,
  } = useDisclosure()
  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure()
  const [shareListInfo] = useShareListInfo()

  return (
    <>
      <AppbarSticky position={isHolder ? 'sticky' : 'relative'}>
        <RowAppbar
          left={
            <AppbarButton
              onClick={isHolder ? goBack : openDrawer}
              className={isHolder ? '' : 'setting'}
            >
              {isHolder ? <BackSvg /> : <SettingsSvg />}
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
      {user && (
        <Share
          isOpen={isOpenShare}
          onClose={onCloseShare}
          shareUrl={`https://${window.location.pathname}/holder/${
            address ?? ''
          }`}
          poster={{
            type: PosterType.Holder,
            data: {
              username: user.nickname,
              avatarUrl: user.avatar_url,
              collectionCount: shareListInfo.len,
              desc: user.description,
              coverImage: shareListInfo.firstImageUrl,
            },
          }}
        />
      )}
    </>
  )
}
