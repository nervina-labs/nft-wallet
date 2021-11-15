import { Box, Flex, Image } from '@chakra-ui/react'
import { useRef, useState } from 'react'
import UserBgPath from '../../../../assets/share/bg/user.png'
import { usePosterLoader } from '../../hooks/usePosterLoader'
import { PosterProps } from '../../share.interface'
import { Footer } from '../footer'
import AvatarVerifiedPath from '../../../../assets/share/icons/avatar-verified.png'
import IssuerIconCN from '../../../../assets/share/icons/issuer-cn.png'
import IssuerIconEN from '../../../../assets/share/icons/issuer-en.png'
import { useUrlToBase64 } from '../../../../hooks/useUrlToBase64'
import { useTranslation } from 'react-i18next'
import { useTextEllipsis } from '../../hooks/useTextEllipsis'
import FallbackAvatarPath from '../../../../assets/img/fallback.png'
import FallbackImgPath from '../../../../assets/img/nft-fallback.png'
import { DescContainer } from './holder'

const ISSUER_ICON_MAP: { [key: string]: string } = {
  en: IssuerIconEN,
  zh: IssuerIconCN,
}

export interface IssuerProps {
  username: string
  avatarUrl: string
  isVerified?: boolean
  verifiedTitle?: string
  desc: string
  follow: string | number
  like: string | number
  coverImage: string
}

export const Issuer: React.FC<IssuerProps & PosterProps> = ({
  isVerified,
  verifiedTitle,
  username,
  avatarUrl,
  shareUrl,
  follow,
  like,
  desc,
  coverImage,
  onLoaded,
}) => {
  const { t, i18n } = useTranslation('translations')
  const ref = useRef<HTMLDivElement>(null)
  const { data: coverImageUrl, isLoading: coverImageLoading } = useUrlToBase64(
    coverImage,
    {
      toBlob: true,
    }
  )
  const { data: issuerAvatarUrl, isLoading: avatarUrlLoading } = useUrlToBase64(
    avatarUrl,
    {
      fallbackImg: FallbackAvatarPath,
      usePreviewUrl: 100,
      toBlob: true,
    }
  )
  usePosterLoader(ref.current, onLoaded, avatarUrlLoading || coverImageLoading)
  const [issuerName] = useTextEllipsis(username, 300)
  const [verifiedTitleEllipsis] = useTextEllipsis(verifiedTitle ?? '', 300)
  const [descEllipsis] = useTextEllipsis(desc ?? '', 900)
  const [isCoverImageError, setIsCoverImageError] = useState(false)

  return (
    <Box position="relative" w="340px" h="490px" ref={ref}>
      {isCoverImageError ? (
        <Image
          src={FallbackImgPath}
          w="full"
          h="auto"
          left="0"
          top="0"
          position="absolute"
          zIndex={-1}
        />
      ) : null}
      <Image
        src={coverImageUrl}
        w="full"
        h="auto"
        left="0"
        top="0"
        position="absolute"
        zIndex={0}
        onError={() => setIsCoverImageError(true)}
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
            border="2px solid #f6f6f6"
          />
          {isVerified && (
            <Image
              src={AvatarVerifiedPath}
              w="10px"
              h="10px"
              bottom="0"
              right="0"
              position="absolute"
            />
          )}
        </Box>
        <Box fontSize="14px" fontWeight="500" mt="5px">
          {issuerName}
        </Box>
        <Flex mt="5px" fontSize="12px" color="#777E90">
          <Image
            h="14px"
            src={ISSUER_ICON_MAP[i18n.language] ?? ISSUER_ICON_MAP.en}
            alt="icon"
            mr="5px"
            my="auto"
          />
          {verifiedTitleEllipsis}
        </Flex>
        <Box mt="15px" fontSize="12px" fontWeight="200">
          <Box as="span" mr="5px">
            {t('issuer.follower')}: {follow}
          </Box>
          {t('issuer.like')}: {like}
        </Box>
        <DescContainer>{descEllipsis}</DescContainer>
        {shareUrl && (
          <Footer url={shareUrl} text={t('common.share.poster.desc-issuer')} />
        )}
      </Flex>
    </Box>
  )
}
