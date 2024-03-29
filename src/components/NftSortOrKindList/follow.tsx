import { useCallback } from 'react'
import { useAPI } from '../../hooks/useAccount'
import { useGetAndSetAuth, useProfile } from '../../hooks/useProfile'
import { InfiniteList } from '../InfiniteList'
import { Query, ClassSortType as SortType } from '../../models'
import {
  Box,
  Limited,
  NFTCard,
  Center,
  Button,
  Grid,
  Avatar,
} from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { TokenClass } from '../../models/class-list'
import { Link, useHistory } from 'react-router-dom'
import { ReactComponent as EmptySvg } from '../../assets/svg/follow-empty.svg'
import { ReactComponent as UnFollowSvg } from '../../assets/svg/unfollow.svg'
import { isSupportWebp } from '../../utils'
import { useTrackEvent } from '../../hooks/useTrack'
import styled from '@emotion/styled'

const StyledEmptySvg = styled(EmptySvg)`
  margin: 0 auto;
`

const Card: React.FC<{ token: TokenClass }> = ({ token }) => {
  const { t, i18n } = useTranslation('translations')
  const { push } = useHistory()
  const gotoClass = useCallback(() => {
    push(`/class/${token.uuid}`)
  }, [push, token.uuid])
  const gotoIssuer = useCallback(() => {
    if (token.issuer_info?.uuid) {
      push(`/issuer/${token.issuer_info?.uuid}`)
    }
  }, [push, token.issuer_info?.uuid])

  const trackGoto = useTrackEvent(
    'go-nft-from-explore-follow',
    'click',
    undefined,
    gotoClass
  )

  return (
    <Box key={token.uuid} w="full" pb="30px" cursor="pointer">
      <NFTCard
        locale={i18n.language}
        src={token.bg_image_url === null ? '' : token.bg_image_url}
        title={token.name}
        type={token.renderer_type}
        hasCardback={token.card_back_content_exist}
        w="full"
        resizeScale={500}
        imageProps={{
          webp: isSupportWebp(),
          customizedSize: {
            fixed: 'large',
          },
        }}
        onClick={trackGoto}
        rounded="30px"
      />
      <Grid
        templateColumns="25px calc(100% - 25px - 65px) 60px"
        onClick={gotoIssuer}
      >
        <Avatar
          src={
            token.issuer_info?.avatar_url === null
              ? ''
              : token.issuer_info?.avatar_url
          }
          resizeScale={50}
          webp={isSupportWebp()}
          isVerified={token.verified_info?.is_verified}
        />
        <Box
          fontSize="12px"
          fontWeight="300"
          lineHeight="25px"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
          overflow="hidden"
          px="10px"
        >
          {token.issuer_info?.name}
        </Box>
        <Limited
          count={token.total}
          limitedText={t('common.limit.limit')}
          unlimitedText={t('common.limit.unlimit')}
          my="auto"
          textAlign="right"
        />
      </Grid>
    </Box>
  )
}

export const Follow: React.FC<{
  sort: SortType
}> = ({ sort }) => {
  const { t } = useTranslation('translations')
  const { isAuthenticated } = useProfile()
  const getAuth = useGetAndSetAuth()
  const api = useAPI()
  const queryFn = useCallback(
    async ({ pageParam = 0 }) => {
      const auth = await getAuth()
      const { data } = await api.getFollowTokenClasses(auth, pageParam, sort)
      return {
        class_list: data.token_classes,
        meta: data.meta,
      }
    },
    [api, getAuth, sort]
  )

  if (!isAuthenticated) {
    return (
      <Center>
        <Box textAlign="center" mt="100px" px="20px" w="full">
          <StyledEmptySvg />
          <Box color="#777E90" fontSize="14px">
            {t('follow.login.desc-1')}
          </Box>
          <Box color="#777E90" fontSize="14px">
            {t('follow.login.desc-2')}
          </Box>
          <Link to="/login">
            <Button variant="outline" mt="10px" isFullWidth>
              {t('follow.login.login')}
            </Button>
          </Link>
        </Box>
      </Center>
    )
  }

  return (
    <InfiniteList
      enableQuery
      queryFn={queryFn}
      queryKey={[Query.Explore, sort, api]}
      emptyElement={
        <Box textAlign="center" minH="600px">
          <Center mt="100px">
            <UnFollowSvg />
          </Center>
          <Box color="#777E90" mb="16px">
            {t('follow.no-data')}
          </Box>
        </Box>
      }
      noMoreElement={t('common.actions.pull-to-down')}
      calcDataLength={(data) =>
        data?.pages.reduce(
          (acc, token) => token?.class_list?.length + acc,
          0
        ) ?? 0
      }
      columnCount={1}
      renderItems={(group, i) => {
        return group.class_list.map((token, j) => {
          return <Card token={token} key={`${i}-${j}`} />
        })
      }}
      style={{
        overflowX: 'hidden',
      }}
    />
  )
}
