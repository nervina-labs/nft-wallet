import { useQuery } from 'react-query'
import { useParams } from 'react-router'
import { Appbar, AppbarSticky } from '../../components/Appbar'
import { useAPI } from '../../hooks/useAccount'
import { useGetAndSetAuth } from '../../hooks/useProfile'
import { Query } from '../../models'
import { MainContainer } from '../../styles'
import { Heading, Image, Issuer, Progress } from '@mibao-ui/components'
import { Box, Flex, Grid, Skeleton, SkeletonText, Text } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useMemo } from 'react'
import { PackEventDetailResponse } from '../../models/pack-event'
import { Link, Redirect } from 'react-router-dom'
import { RoutePath } from '../../routes'

type PackOptionTokenClasses = PackEventDetailResponse['pack_options']
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
  const tokenClassesEl = tokenClasses.map((item, i) => (
    <Link key={i} to={`/class/${item.token_class.uuid}`}>
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
      >
        <Image
          src={
            item.token_class.bg_image_url === null
              ? ''
              : item.token_class.bg_image_url
          }
          w="100%"
          h="100%"
          rounded="10px"
          opacity={item.is_collected ? 1 : 0.5}
          containerProps={{
            position: 'absolute',
            top: '0',
            left: '0',
          }}
          customizedSize={{
            fixed: 'large',
          }}
          resizeScale={600}
        />
      </Box>
    </Link>
  ))

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
  const getAuth = useGetAndSetAuth()
  const { data, isLoading, error, failureCount } = useQuery(
    [Query.PackEventDetail, id, api],
    async () => {
      const auth = await getAuth()
      const { data } = await api.getPackEventById(id, auth)
      return data
    }
  )
  const [
    normalTokenClass,
    specialTokenClass,
  ] = useMemo<NormalTokenClassAndSpecialTokenClass>(() => {
    if (!data?.pack_options) {
      return [[], []]
    }
    return data?.pack_options.reduce<NormalTokenClassAndSpecialTokenClass>(
      (acc, tokenClass) => {
        return [
          acc[0].concat(tokenClass.is_special_model ? [] : [tokenClass]),
          acc[1].concat(tokenClass.is_special_model ? [tokenClass] : []),
        ]
      },
      [[], []]
    )
  }, [data?.pack_options])

  if (error && failureCount >= 3) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <MainContainer pb="40px">
      <AppbarSticky position="fixed">
        <Appbar transparent></Appbar>
      </AppbarSticky>
      <Image
        src={data?.pack_event_info.cover_image_url}
        w="full"
        maxH="500px"
        minH="200px"
        customizedSize={{
          fixed: 'large',
        }}
        resizeScale={1000}
      />
      <Skeleton isLoaded={!isLoading} mt="20px" mx="20px" minH="24px">
        <Heading
          fontSize="20px"
          textOverflow="ellipsis"
          overflow="hidden"
          noOfLines={2}
        >
          {data?.pack_event_info.name}
        </Heading>
      </Skeleton>
      <SkeletonText isLoaded={!isLoading} noOfLines={2} mx="20px" mt="20px">
        <Text fontSize="14px">{data?.pack_event_info.description}</Text>
      </SkeletonText>
      <Flex fontSize="14px" justify="space-between" mx="20px" mt="40px">
        <Skeleton w="56px" h="21px" isLoaded={!isLoading}>
          {t('pack-event.collection-progress')}
        </Skeleton>
        {data ? (
          <Box>
            {data.record_items_count <= data.pack_event_info.pack_options_count
              ? `${data.record_items_count} / ${data.pack_event_info.pack_options_count}`
              : t('pack-event.collected')}
          </Box>
        ) : null}
      </Flex>
      <Skeleton h="8px" mx="20px" mt="10px" isLoaded={!isLoading}>
        {data ? (
          <Progress
            value={Math.floor(
              (data?.record_items_count /
                data?.pack_event_info.pack_options_count) *
                100
            )}
            colorScheme="primary"
            height="8px"
          />
        ) : null}
      </Skeleton>
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
      <Skeleton
        w="80px"
        h="21px"
        mx="20px"
        mb="15px"
        mt="40px"
        isLoaded={!isLoading}
      >
        <Heading fontSize="16px">{t('pack-event.has-token-class')}</Heading>
      </Skeleton>
      <TokenClassList tokenClasses={normalTokenClass} isLoading={isLoading} />
      {specialTokenClass.length ? (
        <>
          <Skeleton
            w="80px"
            h="21px"
            mx="20px"
            mb="15px"
            mt="40px"
            isLoaded={!isLoading}
          >
            <Heading fontSize="16px">
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
