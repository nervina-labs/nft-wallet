import { useDisclosure } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import {
  AppbarSticky,
  Appbar as RowAppbar,
  AppbarButton,
} from '../../../components/Appbar'
import { PosterType, Share } from '../../../components/Share/next'
import { useHistoryBack } from '../../../hooks/useHistoryBack'
import { formatCount } from '../../../utils'
import { ReactComponent as BackSvg } from '../../../assets/svg/back.svg'
import { ReactComponent as ShareSvg } from '../../../assets/svg/share.svg'
import { useIssuerInfo } from '../hooks/useIssuerInfo'
import { useShareImage } from '../hooks/useShareImage'

export const Appbar: React.FC = () => {
  const goBack = useHistoryBack()
  const { i18n } = useTranslation('translations')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { id } = useParams<{ id: string }>()
  const { data } = useIssuerInfo(id)
  const [shareImage] = useShareImage()

  return (
    <>
      <AppbarSticky>
        <RowAppbar
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
      </AppbarSticky>
      {data && (
        <Share
          isOpen={isOpen}
          onClose={onClose}
          shareUrl={window.location.href}
          poster={{
            type: PosterType.Issuer,
            data: {
              username: data.name,
              avatarUrl: data.avatar_url ?? '',
              isVerified: data.verified_info?.is_verified,
              verifiedTitle: data.verified_info?.verified_title,
              desc: data.description ?? '',
              follow: formatCount(data.issuer_follows, i18n.language),
              like: formatCount(data.issuer_likes, i18n.language),
              coverImage: shareImage,
            },
          }}
        />
      )}
    </>
  )
}
