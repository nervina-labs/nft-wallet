import { Box, Button, Grid, Like } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { useLike } from '../../../hooks/useLikeStatus'
import { TokenClass } from '../../../models/class-list'
import { NFTDetail } from '../../../models/nft'
import { useHistory } from 'react-router-dom'
import { useCallback } from 'react'
import { ReactComponent as BuySvg } from '../../../assets/svg/buy.svg'
import { ReactComponent as TransferSvg } from '../../../assets/svg/transfer.svg'
import {
  currentOrderInfoAtom,
  useOrderDrawer,
  useSetProductId,
} from '../../../hooks/useOrder'
import { useUpdateAtom } from 'jotai/utils'
import { useAccountStatus, useAPI } from '../../../hooks/useAccount'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { IS_WEXIN } from '../../../constants'
import { RoutePath } from '../../../routes'
import { UnipassConfig } from '../../../utils'
import { Query } from '../../../models'
import { useQuery } from 'react-query'

const TranferOrBuy: React.FC<{
  uuid: string
  detail?: NFTDetail | TokenClass
  isClass?: boolean
}> = ({ uuid, detail, isClass }) => {
  const { t } = useTranslation('translations')
  const { push } = useHistory()
  const tranfer = useCallback(() => {
    push(`/transfer/${uuid}`, {
      nftDetail: detail,
    })
  }, [push, uuid, detail])

  const ownCurrentToken =
    typeof detail?.class_card_back_content !== 'undefined' ||
    typeof detail?.card_back_content !== 'undefined'

  const { openOrderDrawer } = useOrderDrawer()
  const setProductId = useSetProductId()

  const setProductInfo = useUpdateAtom(currentOrderInfoAtom)
  const api = useAPI()
  const getAuth = useGetAndSetAuth()
  const { isLogined } = useAccountStatus()
  const history = useHistory()

  const { data: user } = useQuery(
    [Query.Tags, api],
    async () => {
      const data = await api.getProfile()
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: IS_WEXIN,
    }
  )

  const orderOnClick = useCallback(async () => {
    if (!detail?.product_on_sale_uuid) {
      return
    }
    if (!isLogined) {
      UnipassConfig.setRedirectUri(location.pathname)
      history.push(RoutePath.Login)
      return
    }
    if (!user?.open_id && IS_WEXIN) {
      const auth = await getAuth()
      const {
        data: { oauth_url: authUrl },
      } = await api.getWechatOauthUrl(auth)
      location.href = authUrl
      return
    }
    setProductId(detail?.product_on_sale_uuid)
    setProductInfo({
      type: detail?.renderer_type,
      coverUrl: detail?.bg_image_url,
      price: detail?.product_price,
      remain: detail?.product_count,
      limit: detail?.product_limit,
      name: detail?.name,
      currency: detail?.product_price_currency,
      hasCardback: detail?.card_back_content_exist,
    })
    openOrderDrawer()
  }, [
    detail,
    setProductId,
    setProductInfo,
    openOrderDrawer,
    api,
    getAuth,
    history,
    isLogined,
    user,
  ])

  const isSoldout = Number(detail?.product_count) === 0

  if (isClass) {
    return detail?.product_on_sale_uuid ? (
      <Button
        colorScheme="primary"
        variant="solid"
        my="auto"
        mr="0"
        onClick={orderOnClick}
        isDisabled={isSoldout}
        fontWeight="normal"
        fontSize="14px"
      >
        <Box as="span" mr="10px">
          {isSoldout ? t('shop.sold-out') : t('shop.buy')}
        </Box>
        <BuySvg />
      </Button>
    ) : null
  }

  if (!ownCurrentToken) {
    return null
  }

  return (
    <Button
      colorScheme="primary"
      variant="solid"
      my="auto"
      mr="0"
      onClick={tranfer}
      fontWeight="normal"
      fontSize="14px"
    >
      <Box as="span" mr="10px">
        {t('nft.transfer')}
      </Box>
      <TransferSvg />
    </Button>
  )
}

export const Footer: React.FC<{
  hidden?: boolean
  uuid: string
  detail?: NFTDetail | TokenClass
  isClass?: boolean
}> = ({ detail, uuid, hidden, isClass }) => {
  const { i18n } = useTranslation('translations')
  const { likeCount, isLikeLoading, toggleLike, isLiked } = useLike({
    count: Number(detail?.class_likes) ?? 0,
    liked: detail?.class_liked || false,
    locale: i18n.language,
    uuid: (detail as NFTDetail)?.class_uuid ?? uuid,
  })

  return (
    <Grid
      templateColumns="calc(100% - 120px) 120px"
      position="sticky"
      bottom="0"
      transform={`translateY(${hidden ? '60px' : '0'})`}
      transition="transform 300ms"
      h="60px"
      bg="white"
      px="20px"
      mt="auto"
      borderTop="1px solid #e1e1e1"
      zIndex={5}
    >
      <Like
        likeCount={likeCount}
        isLiked={isLiked}
        isLoading={isLikeLoading}
        onClick={toggleLike}
        my="auto"
      />

      <TranferOrBuy uuid={uuid} detail={detail} isClass={isClass} />
    </Grid>
  )
}
