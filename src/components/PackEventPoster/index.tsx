import { Box, Flex, Grid, Image } from '@chakra-ui/react'
import { useEffect, useRef, useState } from 'react'
import Bg from '../../assets/share/bg/pack-event.png'
import Collected from '../../assets/img/pack-event-collected.png'
import { PackEventDetailResponse } from '../../models/pack-event'
import { PosterOnLoaded } from '../Share/share.interface'
import FallbackAvatarPath from '../../assets/img/fallback.png'
import { useUrlToBase64 } from '../../hooks/useUrlToBase64'
import { useGetAndSetAuth, useProfile } from '../../hooks/useProfile'
import { Query } from '../../models'
import { useQuery } from 'react-query'
import { useAccount, useAPI } from '../../hooks/useAccount'
import { useTranslation } from 'react-i18next'
import { addParamsToUrl, getNFTQueryParams } from '../../utils'
import { useTextEllipsis } from '../Share/hooks/useTextEllipsis'
import { Progress } from '@mibao-ui/components'
import QRCode from 'qrcode.react'
import PackEventSpecialModalPath from '../../assets/img/pack-event-special.png'

function useUserInfo() {
  const api = useAPI()
  const { address } = useAccount()
  const getAuth = useGetAndSetAuth()
  const { isAuthenticated } = useProfile()
  return useQuery(
    [Query.Profile, address, api, isAuthenticated],
    async () => {
      if (isAuthenticated) {
        const auth = await getAuth()
        return await api.getProfile(address, auth)
      }
    },
    {
      enabled: !!address,
    }
  )
}

export const PackEventPoster: React.FC<{
  onLoaded: PosterOnLoaded
  data: PackEventDetailResponse
  shareUrl: string
}> = ({ onLoaded, data, shareUrl }) => {
  const { t, i18n } = useTranslation('translations')
  const ref = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const rendered = ref.current !== null
  const { data: userInfo, isLoading: isLoadingUserInfo } = useUserInfo()
  const { data: avatarUrl, isLoading: avatarUrlLoading } = useUrlToBase64(
    addParamsToUrl(
      userInfo?.avatar_url as string,
      Object.create(
        getNFTQueryParams(userInfo?.avatar_tid, i18n.language) || {}
      )
    ) ?? '',
    {
      fallbackImg: FallbackAvatarPath,
      size: 100,
      toBlob: true,
    }
  )
  const { data: images, isLoading: isLoadingImages } = useUrlToBase64(
    data.pack_options_info
      .slice(0, 9)
      .map((pack) =>
        pack.is_special_model && !pack.is_collected
          ? PackEventSpecialModalPath
          : pack.token_class.bg_image_url
      ),
    {
      size: 600,
      toBlob: true,
    }
  )
  const [nameEllipsis] = useTextEllipsis(data.name || '', 280, {
    font: '16px',
  })
  const nicknameEllipsis =
    userInfo?.nickname && userInfo?.nickname?.length > 18
      ? `${userInfo?.nickname?.substring(0, 18)}…`
      : userInfo?.nickname
  useEffect(() => {
    if (
      !isLoaded &&
      rendered &&
      !avatarUrlLoading &&
      !isLoadingUserInfo &&
      !isLoadingImages
    ) {
      setIsLoaded(true)
      onLoaded(ref.current)
    }
  }, [
    avatarUrlLoading,
    isLoaded,
    isLoadingImages,
    isLoadingUserInfo,
    onLoaded,
    rendered,
  ])

  const isCollected =
    data.current_user_record_info &&
    data.current_user_record_info?.record_items_count >= data.pack_options_count

  return (
    <Box ref={ref} position="relative" w="340px" h="509px">
      <Image src={Bg} />
      <Grid
        templateColumns="35px calc(100% - 35px)"
        position="absolute"
        top="30px"
        left="30px"
        h="35px"
      >
        <Image
          src={avatarUrl}
          w="35px"
          h="100%"
          objectFit="cover"
          rounded="100%"
        />
        <Flex
          direction="column"
          h="35px"
          pl="10px"
          justify="space-between"
          pb="2px"
        >
          <Box
            color="#fff"
            whiteSpace="nowrap"
            fontSize="14px"
            lineHeight="14px"
          >
            {nicknameEllipsis || t('holder.user-name-empty')}
          </Box>
          <Box
            color="#E6E8EC"
            whiteSpace="nowrap"
            fontSize="12px"
            lineHeight="14px"
          >
            {t('pack-event.collecting-digital-collection-sets')}
          </Box>
        </Flex>
      </Grid>

      <Grid
        templateColumns="repeat(3, 70px)"
        columnGap="8px"
        templateRows="repeat(3, 70px)"
        rowGap="13px"
        position="absolute"
        left="57px"
        top="87px"
      >
        {images
          ?.filter((src) => src)
          .map((src, i) => (
            <Image
              src={src}
              key={i}
              rounded="22px"
              h="70px"
              w="70px"
              objectFit="cover"
              opacity={data.pack_options_info[i].is_collected ? 1 : 0.5}
            />
          ))}
      </Grid>
      <Box
        position="absolute"
        top="340px"
        left="30px"
        color="#fff"
        fontSize="16px"
      >
        {nameEllipsis}
      </Box>
      <Box position="absolute" top="400px" left="30px" w="280px">
        <Progress
          value={
            data?.current_user_record_info
              ? (data?.current_user_record_info?.record_items_count /
                  data?.pack_options_count) *
                100
              : 0
          }
          height="8px"
          w="full"
          colorScheme="primary"
        />
        <Flex justify="space-between" color="#fff" fontSize="12px" mt="4px">
          <Box>{t('pack-event.collection-progress')}</Box>
          {isCollected ? (
            <Flex align="center" color="#FFC635" position="relative" pl="18px">
              <Image
                src={Collected}
                w="auto"
                h="14px"
                position="absolute"
                top="2px"
                left="0"
              />
              {t('pack-event.collected')}
            </Flex>
          ) : (
            <Box>
              {data.current_user_record_info?.record_items_count || 0} /{' '}
              {data.pack_options_count}
            </Box>
          )}
        </Flex>
      </Box>
      <Flex position="absolute" bottom="16px" right="30px">
        <Box
          fontSize="12px"
          ml="auto"
          mr="8px"
          textAlign="right"
          my="auto"
          lineHeight="17px"
          color="#777E90"
        >
          <Box color="#fff">{t('common.share.poster.desc-1')}</Box>
          {t('pack-event.let-go-to-collect')}
        </Box>
        <QRCode
          value={shareUrl}
          style={{
            width: '40px',
            height: '40px',
            marginTop: 'auto',
          }}
        />
      </Flex>
    </Box>
  )
}
