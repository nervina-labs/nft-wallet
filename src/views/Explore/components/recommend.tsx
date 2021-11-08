import {
  Box,
  Image,
  AspectRatio,
  Flex,
  Grid,
  Avatar,
  Skeleton,
} from '@mibao-ui/components'
import { useQuery } from 'react-query'
import { useAPI } from '../../../hooks/useAccount'
import { Query } from '../../../models'
import { SpecialAssets } from '../../../models/special-assets'
import { ReactComponent as MoreSvg } from '../../../assets/svg/recommend-more.svg'
import { useTranslation } from 'react-i18next'
import { Link, useHistory } from 'react-router-dom'
import { useCallback } from 'react'
import { isSupportWebp } from '../../../utils'

const Item: React.FC<SpecialAssets> = ({
  locales,
  uuid,
  bg_color: bgColor,
  token_classes: tokenClasses,
}) => {
  const { t, i18n } = useTranslation('translations')
  const { push } = useHistory()
  const gotoCollection = useCallback(() => {
    push(`/explore/collection/${uuid}`)
  }, [push, uuid])

  return (
    <>
      <Flex
        h="105px"
        position="relative"
        justify="center"
        pb="15px"
        onClick={gotoCollection}
        cursor="pointer"
      >
        {tokenClasses.slice(0, 3).map((t, i) => (
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
          <Flex
            fontSize="12px"
            color="#777E90"
            cursor="pointer"
            onClick={gotoCollection}
          >
            <Box mt="auto" mr="5px">
              {t('explore.more')}
            </Box>
            <Box my="auto">
              <MoreSvg />
            </Box>
          </Flex>
        </Flex>

        {tokenClasses.map((tokenClass, i) => (
          <Link to={`/class/${tokenClass.uuid}`} key={i}>
            <Grid mb="10px" templateColumns="auto 70%">
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
                  rounded="10px"
                />
              </AspectRatio>
              <Flex direction="column" py="5px" pl="10px">
                <Box
                  fontSize="14px"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                  overflow="hidden"
                  mb="auto"
                >
                  {tokenClass.name}
                </Box>
                <Link to={`/issuer/${tokenClass.issuer_info.uuid}`}>
                  <Flex>
                    <Avatar
                      src={
                        tokenClass.issuer_info.avatar_url === null
                          ? ''
                          : tokenClass.issuer_info.avatar_url
                      }
                      isVerified={tokenClass?.verified_info?.is_verified}
                      resizeScale={150}
                      webp={isSupportWebp()}
                      size="25px"
                    />
                    <Box
                      fontSize="12px"
                      textOverflow="ellipsis"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      w="calc(100% - 30px)"
                      lineHeight="25px"
                      ml="5px"
                    >
                      {tokenClass.issuer_info.name}
                    </Box>
                  </Flex>
                </Link>
              </Flex>
            </Grid>
          </Link>
        ))}
      </Box>
    </>
  )
}

export const Recommend: React.FC = () => {
  const api = useAPI()
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

  return (
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
            {data?.special_categories.map((specialAssets, i) => (
              <Flex
                w="90%"
                direction="column"
                shrink={0}
                pr="15px"
                maxW="305px"
                key={i}
              >
                <Item {...specialAssets} />
              </Flex>
            ))}
          </>
        )}
      </Flex>
    </Box>
  )
}
