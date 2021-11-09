import { Box, Limited } from '@mibao-ui/components'
import { Flex, Image } from '@chakra-ui/react'
import NftBgPath from '../../../../assets/share/bg/nft.png'
import AvatarVerifiedPath from '../../../../assets/share/icons/avatar-verified.png'
import { useTranslation } from 'react-i18next'
import { Footer } from '../footer'
import { useUrlToBase64 } from '../../../../hooks/useUrlToBase64'
import { PosterProps } from '../../poster.interface'
import { useRef } from 'react'
import { usePosterLoader } from '../../hooks/usePosterLoader'
import { useTextEllipsis } from '../../hooks/useTextEllipsis'
import FallbackAvatarPath from '../../../../assets/img/fallback.png'

export interface NftProps {
  bgImgUrl: string
  name: string
  limited: {
    count: number | string
    serialNumber?: number
  }
  issuer: {
    avatarUrl?: string | null
    isVerified?: boolean
    name: string
  }
}

export const Nft: React.FC<NftProps & PosterProps> = ({
  bgImgUrl,
  name,
  limited,
  issuer,
  shareUrl,
  onLoaded,
}) => {
  const { t, i18n } = useTranslation('translations')
  const { data: bgImageUrl, isLoading: bgImageUrlLoading } = useUrlToBase64(
    bgImgUrl,
    {
      usePreviewUrl: 500,
    }
  )
  const { data: avatarUrl, isLoading: avatarUrlLoading } = useUrlToBase64(
    issuer.avatarUrl ?? '',
    {
      fallbackImg: FallbackAvatarPath,
      usePreviewUrl: 100,
    }
  )
  const [nftName] = useTextEllipsis(name, 150)
  const [issuerName] = useTextEllipsis(issuer.name, 240)
  const ref = useRef<HTMLDivElement>(null)
  usePosterLoader(ref.current, onLoaded, bgImageUrlLoading || avatarUrlLoading)

  return (
    <Box position="relative" w="340px" h="509px" ref={ref}>
      <Image src={NftBgPath} w="full" h="auto" />
      <Flex
        position="absolute"
        w="full"
        h="full"
        pt="25px"
        px="20px"
        pb="15px"
        top="0"
        left="0"
        zIndex={1}
        direction="column"
      >
        <Box bg="white" w="full" rounded="10%" p="20px">
          <Image
            src={bgImageUrl}
            rounded="10%"
            w="260px"
            h="260px"
            objectFit="cover"
          />
          <Flex justify="space-between" mt="16px">
            <Box fontWeight="600" fontSize="16px">
              {nftName}
            </Box>
            <Limited
              count={limited.count}
              serialNumber={limited.serialNumber}
              limitedText={t('common.limit.limit')}
              unlimitedText={t('common.limit.unlimit')}
              locale={i18n.language}
            />
          </Flex>
          <Flex mt="8px">
            <Box position="relative">
              <Image
                src={avatarUrl}
                w="25px"
                h="25px"
                rounded="100%"
                objectFit="cover"
                border="2px solid #f6f6f6"
              />
              {issuer.isVerified && (
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
            <Box
              color="#777E90"
              fontSize="13px"
              whiteSpace="nowrap"
              textOverflow="ellipsis"
              overflow="hidden"
              lineHeight="25px"
              ml="10px"
            >
              {issuerName}
            </Box>
          </Flex>
        </Box>

        {shareUrl && <Footer url={shareUrl} />}
      </Flex>
    </Box>
  )
}
