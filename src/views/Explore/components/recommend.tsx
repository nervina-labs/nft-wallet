import {
  Box,
  Image,
  AspectRatio,
  Flex,
  Grid,
  Skeleton,
  Issuer,
} from '@mibao-ui/components'
import { useQuery } from 'react-query'
import { useAPI } from '../../../hooks/useAccount'
import { Query } from '../../../models'
import { SpecialAssets } from '../../../models/special-assets'
import { ReactComponent as MoreSvg } from '../../../assets/svg/recommend-more.svg'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { isSupportWebp } from '../../../utils'
import FALLBACK from '../../../assets/img/nft-fallback.png'
import { Heading } from './heading'

const Item: React.FC<SpecialAssets> = ({
  locales,
  uuid,
  bg_color: bgColor,
  token_classes: tokenClasses,
}) => {
  const { t, i18n } = useTranslation('translations')

  return (
    <>
      <Flex h="105px" position="relative" justify="center" pb="15px">
        {[1, 0, 2]
          .map((i) => tokenClasses[i])
          .filter((t) => t)
          .map((t, i) => (
            <Image
              key={i}
              src={t.bg_image_url === null ? '' : t.bg_image_url}
              w="full"
              h="full"
              resizeScale={100}
              webp={isSupportWebp()}
              containerProps={{
                w: i === 1 ? '90px' : '70px',
                h: i === 1 ? '90px' : '70px',
                shadow: '0px 6px 10px rgba(0, 0, 0, 0.2)',
                rounded: '22px',
                overflow: 'hidden',
                mt: 'auto',
                zIndex: i === 1 ? 2 : 1,
              }}
              fallbackSrc={FALLBACK}
            />
          ))}
        <Box
          position="absolute"
          w="full"
          h="60px"
          zIndex={0}
          bottom="0"
          left={0}
          bg={`linear-gradient(360deg, ${bgColor} -16.67%, rgba(194, 201, 254, 0.24) 80.56%)`}
          transform="perspective(50px) rotateX(60deg)"
          transformOrigin="bottom"
          opacity={0.7}
        />
      </Flex>
      <Box
        w="full"
        shadow="0px 4px 10px rgba(168, 193, 221, 0.3)"
        rounded="0 0 16px 16px"
        p="12px"
        pt="10px"
        pb="10px"
      >
        <Flex justify="space-between" mb="15px">
          <Box fontSize="14px">{locales?.[i18n.language]}</Box>
          <Flex fontSize="12px" color="#777E90">
            <Box mt="auto" mr="5px">
              {t('explore.more')}
            </Box>
            <Box my="auto">
              <MoreSvg />
            </Box>
          </Flex>
        </Flex>

        {tokenClasses.map((tokenClass, i) => (
          <Grid mb="10px" templateColumns="auto 70%" key={i}>
            <AspectRatio ratio={1 / 1}>
              <Image
                src={
                  tokenClass.bg_image_url === null
                    ? ''
                    : tokenClass.bg_image_url
                }
                w="full"
                h="full"
                resizeScale={100}
                webp={isSupportWebp()}
                rounded="22px"
                fallbackSrc={FALLBACK}
              />
            </AspectRatio>
            <Flex direction="column" py="5px" pl="10px" justify="center">
              <Box
                fontSize="14px"
                textOverflow="ellipsis"
                overflow="hidden"
                mb="4px"
                noOfLines={2}
              >
                {tokenClass.name}
              </Box>
              <Issuer
                name={tokenClass.issuer_info.name}
                size="25px"
                src={
                  tokenClass.issuer_info.avatar_url === null
                    ? ''
                    : tokenClass.issuer_info.avatar_url
                }
                isVerified={tokenClass?.verified_info?.is_verified}
                resizeScale={100}
                webp={isSupportWebp()}
              />
            </Flex>
          </Grid>
        ))}
      </Box>
    </>
  )
}

export const Recommend: React.FC = () => {
  const api = useAPI()
  const { t } = useTranslation('translations')
  const { data, isLoading } = useQuery(
    [Query.Collections, api],
    async () => {
      const { data } = await api.getSpecialAssets()
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )

  if (!isLoading && !data?.special_categories.length) {
    return null
  }

  return (
    <>
      <Heading>{t('explore.title-recommended')}</Heading>
      <Box overflowY="hidden" overflowX={isLoading ? 'hidden' : 'auto'}>
        <Flex w="auto" p="20px">
          {isLoading ? (
            <>
              {[0, 1].map((k) => (
                <Skeleton
                  w="90%"
                  maxWidth="305px"
                  h="400px"
                  mr="15px"
                  flexShrink={0}
                  rounded="15px"
                  key={k}
                />
              ))}
            </>
          ) : (
            <>
              {data?.special_categories
                .filter((specialAssets) => specialAssets.token_classes.length)
                .map((specialAssets, i) => (
                  <Flex
                    w="90%"
                    direction="column"
                    shrink={0}
                    pr="15px"
                    maxW="305px"
                    key={i}
                    cursor="pointer"
                  >
                    <Link to={`/explore/collection/${specialAssets.uuid}`}>
                      {specialAssets.token_classes?.length >= 3 ? (
                        <Item {...specialAssets} />
                      ) : null}
                    </Link>
                  </Flex>
                ))}
            </>
          )}
        </Flex>
      </Box>
    </>
  )
}
