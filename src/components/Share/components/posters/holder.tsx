import { Box, Flex, Image } from '@chakra-ui/react'
import { useRef } from 'react'
import UserBgPath from '../../../../assets/share/bg/user.png'
import { usePosterLoader } from '../../hooks/usePosterLoader'
import { PosterProps } from '../../poster.interface'
import { Footer } from '../footer'
import { useUrlToBase64 } from '../../../../hooks/useUrlToBase64'
import { useTranslation } from 'react-i18next'
import { useTextEllipsis } from '../../hooks/useTextEllipsis'
import NftAvatarPath from '../../../../assets/share/icons/nft-avatar-diamonds.png'
import FallbackAvatarPath from '../../../../assets/img/fallback.png'
import styled from '@emotion/styled'

export const DescContainer = styled(Box)`
  -webkit-line-clamp: 5;
  font-size: 12px;
  margin-top: 5px;
  white-space: pre-wrap;
  text-overflow: ellipsis;
  overflow: hidden;
`

export interface HolderProps {
  username: string
  avatarUrl: string
  collectionCount: number
  desc: string
  coverImage: string
  isNftAvatar?: boolean
}

export const Holder: React.FC<HolderProps & PosterProps> = ({
  username,
  avatarUrl,
  isNftAvatar,
  collectionCount,
  shareUrl,
  desc,
  coverImage,
  onLoaded,
}) => {
  const { t } = useTranslation('translations')
  const ref = useRef<HTMLDivElement>(null)
  const { data: coverImageUrl, isLoading: coverImageLoading } = useUrlToBase64(
    coverImage ?? '',
    {
      usePreviewUrl: 500,
    }
  )
  const { data: issuerAvatarUrl, isLoading: avatarUrlLoading } = useUrlToBase64(
    avatarUrl ?? '',
    {
      fallbackImg: FallbackAvatarPath,
      usePreviewUrl: 100,
    }
  )
  usePosterLoader(ref.current, onLoaded, avatarUrlLoading || coverImageLoading)
  const [issuerName] = useTextEllipsis(username, 300)
  const [descEllipsis] = useTextEllipsis(desc ?? '', 900)

  return (
    <Box position="relative" w="340px" h="490px" ref={ref}>
      <Image
        src={coverImageUrl}
        w="full"
        h="auto"
        left="0"
        top="0"
        position="absolute"
        zIndex={0}
      />
      <Image
        src={UserBgPath}
        w="full"
        h="auto"
        left="0"
        bottom="0"
        position="absolute"
        zIndex={0}
      />
      <Flex
        position="absolute"
        zIndex={1}
        left="0"
        bottom="0"
        w="full"
        h="308px"
        py="15px"
        px="20px"
        direction="column"
      >
        <Box position="relative" w="50px" h="50px">
          <Image
            src={issuerAvatarUrl}
            w="50px"
            h="50px"
            rounded="100%"
            objectFit="cover"
            border={isNftAvatar ? '2px solid #fabe3c' : '2px solid #f6f6f6'}
          />
          {isNftAvatar && (
            <Image
              src={NftAvatarPath}
              w="20px"
              h="20px"
              top="-5px"
              right="-5px"
              position="absolute"
            />
          )}
        </Box>
        <Box fontSize="14px" fontWeight="500" mt="10px">
          {issuerName}
        </Box>
        <Box mt="5px" fontSize="12px" fontWeight="200">
          {t('common.share.poster.collected')}: {collectionCount}
        </Box>
        <DescContainer>{descEllipsis}</DescContainer>
        {shareUrl && (
          <Footer url={shareUrl} text={t('common.share.poster.desc-holder')} />
        )}
      </Flex>
    </Box>
  )
}
