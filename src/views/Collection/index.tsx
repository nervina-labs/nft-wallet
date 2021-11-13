import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { Link, Redirect, useParams } from 'react-router-dom'
import { Query } from '../../models'
import { TokenClass } from '../../models/class-list'
import { isSupportWebp } from '../../utils'
import {
  Appbar as RowAppbar,
  AppbarButton,
  AppbarSticky,
} from '../../components/Appbar'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'
import { MainContainer } from '../../styles'
import { useAPI } from '../../hooks/useAccount'
import { Box, Center, Flex, Image } from '@mibao-ui/components'
import { InfiniteList } from '../../components/InfiniteList'
import FALLBACK from '../../assets/svg/fallback.svg'
import { useHistoryBack } from '../../hooks/useHistoryBack'
import styled from 'styled-components'
import { RankTop } from './ranktop'
import { RoutePath } from '../../routes'
import { useFirstOpenScrollToTop } from '../../hooks/useFirstOpenScrollToTop'

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

export const Appbar: React.FC<{ title: string }> = ({ title }) => {
  const goBack = useHistoryBack()
  return (
    <AppbarSticky>
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

export const Collection: React.FC = () => {
  const { i18n } = useTranslation('translations')
  const { id } = useParams<{ id: string }>()
  const api = useAPI()
  const { data, failureCount, error } = useQuery(
    [Query.CollectionDetail, api, id],
    async () => {
      const { data } = await api.getCollectionDetail(id)
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    }
  )
  const queryFn = useCallback(
    async ({ pageParam = 1 }) => {
      const { data } = await api.getCollection(id, pageParam)
      return data
    },
    [api, id]
  )
  const [topTokenClass, setTopTokenClass] = useState<TokenClass[] | undefined>()
  useFirstOpenScrollToTop()

  if (error && failureCount >= 3) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <Container>
      <Appbar title={data?.locales?.[i18n.language] ?? ''} />
      <Flex h="200px" justify="center" mb="50px" position="relative" zIndex={2}>
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
      <BgAnimation />
      <Box
        px="20px"
        bg="linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #FFFFFF 10%)"
        minH="calc(100vh - 300px)"
        mt="auto"
      >
        <InfiniteList
          enableQuery
          queryFn={queryFn}
          queryKey={[Query.Collection, api, id]}
          emptyElement={null}
          noMoreElement={null}
          calcDataLength={(data) =>
            data?.pages.reduce(
              (acc, token) => token.class_list.length + acc,
              0
            ) ?? 0
          }
          onDataChange={(group) => {
            setTopTokenClass(group?.pages[0].class_list.slice(0, 3))
          }}
          renderItems={(group, i) => {
            const classList =
              i === 0
                ? group.class_list.slice(3, group.class_list.length)
                : group.class_list
            return classList.map((token, j: number) => (
              <Link to={`/class/${token.uuid}`} key={`${i}-${j}`}>
                <Flex mb="16px">
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
                    ml="10px"
                    textOverflow="ellipsis"
                    overflow="hidden"
                    whiteSpace="nowrap"
                  >
                    {token.name}
                  </Box>
                  <RankNumber n={i + j + 4} />
                </Flex>
              </Link>
            ))
          }}
        />
      </Box>
    </Container>
  )
}
