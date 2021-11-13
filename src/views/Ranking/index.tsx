import { Avatar, Box, Center, Flex, Grid, Image } from '@mibao-ui/components'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Link, Redirect, useParams } from 'react-router-dom'
import { useAPI } from '../../hooks/useAccount'
import { Query } from '../../models'
import FALLBACK from '../../assets/img/nft-fallback.png'
import { isSupportWebp } from '../../utils'
import { RankBorderBox } from '../../components/RankIcon'
import { RankTop } from './ranktop'
import { RoutePath } from '../../routes'
import { useFirstOpenScrollToTop } from '../../hooks/useFirstOpenScrollToTop'
import { useHistoryBack } from '../../hooks/useHistoryBack'
import {
  AppbarSticky,
  Appbar as RowAppbar,
  AppbarButton,
} from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { MainContainer } from '../../styles'
import styled from '@emotion/styled'

export const Container = styled(MainContainer)`
  background: linear-gradient(192.04deg, #e5eff5 44.62%, #ffecde 100%);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  position: relative;

  @keyframes run {
    0% {
      transform: translateX(0);
    }

    50% {
      transform: translateX(50%);
    }

    100% {
      transform: translateX(-50%);
    }
  }
`
export const BgAnimation: React.FC = () => {
  return (
    <>
      <Box
        position="absolute"
        top="20px"
        right="20%"
        w="166px"
        h="166px"
        bg="#FFA4E0"
        filter="blur(50px)"
        animation="run 5s ease infinite alternate"
        zIndex={1}
      />
      <Box
        position="absolute"
        top="10px"
        left="20%"
        w="214px"
        h="214px"
        bg="#FFEB90"
        filter="blur(90px)"
        animation="run 10s ease infinite alternate"
        zIndex={1}
      />
    </>
  )
}

export const Appbar: React.FC<{ title: string }> = ({ title }) => {
  const goBack = useHistoryBack()
  return (
    <AppbarSticky backdropFilter="blur(10px)">
      <RowAppbar
        transparent
        left={
          <AppbarButton onClick={goBack}>
            <BackSvg />
          </AppbarButton>
        }
        title={title}
      />
    </AppbarSticky>
  )
}

export const RankNumber: React.FC<{
  n: number
}> = ({ n }) => {
  return (
    <Center
      bg="linear-gradient(192.04deg, #E2E3FF 50.5%, #EADEFF 100%)"
      m="auto"
      mr="0"
      rounded="full"
      w="20px"
      h="20px"
      fontSize="12px"
    >
      {n}
    </Center>
  )
}

export const Ranking: React.FC = () => {
  const { i18n } = useTranslation('translations')
  const { id } = useParams<{ id: string }>()
  const api = useAPI()
  const { data, error, failureCount } = useQuery(
    [Query.RankingList, id],
    async () => {
      const { data } = await api.getRankingList({ uuid: id })
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )
  const topTokenClass = useMemo(() => {
    return data?.token_classes?.slice(0, 3)
  }, [data])
  const issuers = useMemo(() => {
    return data?.issuers?.slice(0, 3)
  }, [data])
  useFirstOpenScrollToTop()

  if (error && failureCount >= 3) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <Container>
      <Appbar title={data?.locales?.[i18n.language] ?? ''} />
      {topTokenClass && (
        <Flex
          h="180px"
          justify="center"
          mb="50px"
          position="relative"
          zIndex={2}
        >
          {[1, 0, 2].map((v) => (
            <Box w="105px" key={v}>
              {topTokenClass?.[v] ? (
                <RankTop
                  rank={v}
                  bgImageUrl={topTokenClass[v].bg_image_url}
                  name={topTokenClass[v].name}
                  uuid={topTokenClass[v].uuid}
                />
              ) : null}
            </Box>
          ))}
        </Flex>
      )}
      {issuers && (
        <Flex
          h="180px"
          justify="center"
          mb="50px"
          position="relative"
          zIndex={2}
          pt="20px"
        >
          {[1, 0, 2].map((v) => (
            <Box w="105px" mt={v === 0 ? '0' : '26px'} key={v}>
              {issuers?.[v] ? (
                <>
                  <RankBorderBox
                    rank={v}
                    w={v === 0 ? '64px' : '52px'}
                    h={v === 0 ? '64px' : '52px'}
                    rounded="full"
                    icon="text"
                    mx="auto"
                  >
                    <Avatar
                      src={
                        issuers[v].avatar_url === null
                          ? ''
                          : issuers[v].avatar_url
                      }
                      size={v === 0 ? '60px' : '48px'}
                      border="none"
                    />
                  </RankBorderBox>
                  <Box
                    fontSize="12px"
                    fontWeight="500"
                    w="full"
                    textOverflow="ellipsis"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textAlign="center"
                    mt="10px"
                  >
                    {issuers[v].name}
                  </Box>
                  <Box
                    w="full"
                    fontSize="12px"
                    fontWeight="300"
                    textOverflow="ellipsis"
                    overflow="hidden"
                    whiteSpace="nowrap"
                    textAlign="center"
                    color="#777E90"
                  >
                    {issuers[v].verified_info?.verified_title}
                  </Box>
                </>
              ) : null}
            </Box>
          ))}
        </Flex>
      )}

      <BgAnimation />
      <Box
        px="20px"
        bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 10%)"
        minH="calc(100vh - 300px)"
        mt="auto"
      >
        {data?.token_classes
          ?.slice(3, data?.token_classes.length)
          .map((token, i) => (
            <Link to={`/class/${token.uuid}`} key={i}>
              <Grid
                mb="16px"
                templateColumns="50px calc(100% - 50px - 20px) 20px"
              >
                <Image
                  src={token.bg_image_url === null ? '' : token.bg_image_url}
                  width="50px"
                  height="50px"
                  rounded="10px"
                  resizeScale={300}
                  webp={isSupportWebp()}
                  fallbackSrc={FALLBACK}
                />
                <Box
                  h="50px"
                  lineHeight="50px"
                  px="10px"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                  fontSize="14px"
                >
                  {token.name}
                </Box>
                <RankNumber n={i + 4} />
              </Grid>
            </Link>
          ))}
        {data?.issuers?.slice(3, data?.issuers.length).map((issuer, i) => (
          <Link to={`/issuer/${issuer.uuid}`} key={i}>
            <Grid
              mb="16px"
              templateColumns="50px calc(100% - 50px - 20px) 20px"
            >
              <Avatar
                src={issuer.avatar_url === null ? '' : issuer.avatar_url}
                width="50px"
                height="50px"
                resizeScale={300}
                isVerified={issuer.verified_info?.is_verified}
                webp={isSupportWebp()}
                fallbackSrc={FALLBACK}
              />
              <Flex h="50px" justify="center" direction="column" px="10px">
                <Box
                  px="10px"
                  textOverflow="ellipsis"
                  overflow="hidden"
                  whiteSpace="nowrap"
                  fontSize="14px"
                  fontWeight="500"
                >
                  {issuer.name}
                </Box>
                {issuer.verified_info?.verified_title ? (
                  <Box
                    color="#777E90"
                    mt="auto"
                    fontSize="12px"
                    textOverflow="ellipsis"
                    overflow="hidden"
                    whiteSpace="nowrap"
                  >
                    {issuer.verified_info?.verified_title}
                  </Box>
                ) : null}
              </Flex>
              <RankNumber n={i + 4} />
            </Grid>
          </Link>
        ))}
      </Box>
    </Container>
  )
}
