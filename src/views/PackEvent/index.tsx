import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { useAccountStatus, useAPI } from '../../hooks/useAccount'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { Query } from '../../models'
import { MainContainer } from '../../styles'
import {
  Heading,
  Image,
  Issuer,
  NftImage,
  Progress,
} from '@mibao-ui/components'
import {
  AspectRatio,
  Box,
  Flex,
  Grid,
  Icon,
  Skeleton,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { PackEventDetailResponse } from '../../models/pack-event'
import { Link, Redirect } from 'react-router-dom'
import { RoutePath } from '../../routes'
import { Appbar } from './components/appbar'
import PackEventSpecialModalPath from '../../assets/img/pack-event-special.png'
import { ReactComponent as CollectedSvg } from '../../assets/svg/pack-event-collected.svg'

type PackOptionTokenClasses = PackEventDetailResponse['pack_options_info']
type NormalTokenClassAndSpecialTokenClass = [
  PackOptionTokenClasses,
  PackOptionTokenClasses
]

const TokenClassList: React.FC<{
  tokenClasses: PackOptionTokenClasses
  isLoading?: boolean
}> = ({ tokenClasses, isLoading = false }) => {
  const loadingEl = useMemo(
    () =>
      new Array(9).fill(0).map((_, i) => (
        <Box
          w="100%"
          h="auto"
          _before={{
            height: '0',
            content: '" "',
            display: 'block',
            paddingBottom: '100%',
          }}
          position="relative"
          key={i}
        >
          <Skeleton w="full" h="full" position="absolute" top="0" left="0" />
        </Box>
      )),
    []
  )
  const tokenClassesEl = tokenClasses
    .filter((item) => !item.token_class.is_banned)
    .map((item, i) => {
      const bgImageUrl =
        item.token_class.bg_image_url === null
          ? ''
          : item.token_class.bg_image_url
      const src =
        item.is_special_model && !item.is_collected
          ? PackEventSpecialModalPath
          : bgImageUrl
      const nftImageEl = (
        <NftImage
          src={src}
          w="100%"
          h="100%"
          rounded="10px"
          opacity={item.is_collected ? 1 : 0.5}
          customizedSize={{
            fixed: 'large',
          }}
          resizeScale={600}
          isBaned={item.token_class.is_banned}
        />
      )
      if (
        (item.is_special_model && !item.is_collected) ||
        item.token_class.is_banned
      ) {
        return nftImageEl
      }
      return (
        <Link key={i} to={`/class/${item.token_class.uuid}`}>
          {nftImageEl}
        </Link>
      )
    })

  return (
    <Grid templateColumns="repeat(3, 1fr)" gap="15px" mx="20px">
      {isLoading ? loadingEl : tokenClassesEl}
    </Grid>
  )
}

export const PackEvent: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('translations')
  const api = useAPI()
  const { isLogined } = useAccountStatus()
  const getAuth = useGetAndSetAuth()
  const { data, isLoading, error, failureCount } = useQuery(
    [Query.PackEventDetail, id, api, isLogined],
    async () => {
      const auth = isLogined ? await getAuth() : undefined
      const { data } = await api.getPackEventById(id, { auth })
      return data
    },
    {
      cacheTime: 0,
    }
  )
  const [
    normalTokenClass,
    specialTokenClass,
  ] = useMemo<NormalTokenClassAndSpecialTokenClass>(() => {
    if (!data?.pack_options_info) {
      return [[], []]
    }
    return data?.pack_options_info.reduce<NormalTokenClassAndSpecialTokenClass>(
      (acc, tokenClass) => {
        return [
          acc[0].concat(tokenClass.is_special_model ? [] : [tokenClass]),
          acc[1].concat(tokenClass.is_special_model ? [tokenClass] : []),
        ]
      },
      [[], []]
    )
  }, [data?.pack_options_info])

  if (error && failureCount >= 3) {
    return <Redirect to={RoutePath.NotFound} />
  }

  const isCollected =
    data?.current_user_record_info &&
    data?.current_user_record_info?.record_items_count >=
      data?.pack_options_count

  return (
    <MainContainer pb="40px">
      <Appbar data={data} id={id} />
      <AspectRatio ratio={1 / 1} w="full">
        <Image
          src={data?.cover_image_url}
          w="full"
          h="full"
          customizedSize={{
            fixed: 'large',
          }}
          resizeScale={1000}
        />
      </AspectRatio>
      <Skeleton isLoaded={!isLoading} mt="20px" mx="20px" minH="24px">
        <Heading
          fontSize="16px"
          textOverflow="ellipsis"
          overflow="hidden"
          noOfLines={2}
        >
          {data?.name}
        </Heading>
      </Skeleton>
      <SkeletonText isLoaded={!isLoading} noOfLines={2} mx="20px" mt="10px">
        <Text fontSize="14px" color="#777E90">
          {data?.description}
        </Text>
      </SkeletonText>
      <Box mx="20px" mt="32px">
        <Link to={`/issuer/${data?.issuer_info.uuid ?? ''}`}>
          <Issuer
            src={
              data?.issuer_info.avatar_url === null
                ? ''
                : data?.issuer_info.avatar_url
            }
            name={data?.issuer_info.name ?? ''}
            verifiedTitle={data?.issuer_info.verified_info?.verified_title}
            isVerified={data?.issuer_info.verified_info?.is_verified}
            size="48px"
          />
        </Link>
      </Box>
      <Flex justify="space-between" mx="20px" mt="40px">
        <Skeleton
          w="56px"
          h="21px"
          isLoaded={!isLoading}
          fontSize="16px"
          whiteSpace="nowrap"
        >
          {t('pack-event.collection-progress')}
        </Skeleton>
        {data ? (
          <Box fontSize="12px">
            {isCollected ? (
              <Flex align="center" color="#FFC635">
                <Icon as={CollectedSvg} mr="6px" my="auto" />
                {t('pack-event.collected')}
              </Flex>
            ) : (
              `${data?.current_user_record_info?.record_items_count || 0} / ${
                data?.pack_options_count
              }`
            )}
          </Box>
        ) : null}
      </Flex>
      <Skeleton h="8px" mx="20px" mt="10px" isLoaded={!isLoading}>
        {data ? (
          <Progress
            value={
              data?.current_user_record_info
                ? (data?.current_user_record_info?.record_items_count /
                    data?.pack_options_count) *
                  100
                : 0
            }
            colorScheme="primary"
            height="8px"
          />
        ) : null}
      </Skeleton>
      <Skeleton
        w="80px"
        h="21px"
        mx="20px"
        mb="10px"
        mt="40px"
        isLoaded={!isLoading}
      >
        <Text fontSize="16px" whiteSpace="nowrap">
          {t('pack-event.has-token-class')}
        </Text>
      </Skeleton>
      <TokenClassList tokenClasses={normalTokenClass} isLoading={isLoading} />
      {specialTokenClass.length ? (
        <>
          <Skeleton
            w="80px"
            h="21px"
            mx="20px"
            mb="10px"
            mt="40px"
            isLoaded={!isLoading}
          >
            <Heading fontSize="16px" whiteSpace="nowrap">
              {t('pack-event.special-token-class')}
            </Heading>
          </Skeleton>
          <TokenClassList
            tokenClasses={specialTokenClass}
            isLoading={isLoading}
          />
        </>
      ) : null}
    </MainContainer>
  )
}
