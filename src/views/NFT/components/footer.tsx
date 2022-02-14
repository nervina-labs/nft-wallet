/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Box, Like } from '@mibao-ui/components'
import { useTranslation } from 'react-i18next'
import { useLike } from '../../../hooks/useLikeStatus'
import { isTokenClass, TokenClass } from '../../../models/class-list'
import { NFTDetail } from '../../../models/nft'
import { useHistory } from 'react-router-dom'
import { useCallback, useMemo } from 'react'
import { ReactComponent as BuySvg } from '../../../assets/svg/buy.svg'
import { ReactComponent as TransferSvg } from '../../../assets/svg/transfer.svg'
import {
  currentOrderInfoAtom,
  useOrderDrawer,
  useSetProductId,
} from '../../../hooks/useOrder'
import { useUpdateAtom } from 'jotai/utils'
import { useAccount, useAccountStatus, useAPI } from '../../../hooks/useAccount'
import { useGetAndSetAuth } from '../../../hooks/useProfile'
import { IS_WEXIN } from '../../../constants'
import { RoutePath } from '../../../routes'
import { UnipassConfig, verifyCkbAddress } from '../../../utils'
import { Query, TransactionStatus } from '../../../models'
import { useQuery } from 'react-query'
import { trackLabels, useTrackClick } from '../../../hooks/useTrack'
import { Button, Flex } from '@chakra-ui/react'
import { OffSiteProductInfoButton } from './offSiteProductInfoButton'
import { addressToScript } from '@nervosnetwork/ckb-sdk-utils'

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
  const { address } = useAccount()

  const ownCurrentToken = useMemo(() => {
    return (
      detail &&
      address &&
      !isTokenClass(detail) &&
      verifyCkbAddress(detail.to_address!) &&
      addressToScript(detail.to_address!).args ===
        addressToScript(address).args &&
      (detail.tx_state === TransactionStatus.Committed ||
        detail.tx_state === TransactionStatus.Submitting)
    )
  }, [detail, address])

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
      const auth = await getAuth()
      const data = await api.getProfile('', auth)
      return data
    },
    {
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      enabled: IS_WEXIN,
    }
  )

  const trackBuy = useTrackClick('nft-detail', 'click')

  const orderOnClick = useCallback(async () => {
    if (!detail?.product_on_sale_uuid) {
      return
    }
    trackBuy(trackLabels.nftDetail.buy + uuid)
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
    trackBuy,
    uuid,
  ])

  const isSoldout = Number(detail?.product_count) === 0
  if (detail && isTokenClass(detail) && detail?.off_site_product_info) {
    return <OffSiteProductInfoButton info={detail.off_site_product_info} />
  }

  if (isClass && detail?.product_on_sale_uuid) {
    return (
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
    )
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

  const trackLike = useTrackClick('nft-detail', 'click')

  return (
    <>
      <Flex
        position="fixed"
        justify="space-between"
        bottom="-40px"
        opacity={hidden ? 0 : 1}
        transform={`translateY(${
          hidden ? '60px' : 'calc(0px - var(--safe-area-inset-bottom))'
        })`}
        transition="transform 100ms"
        h="100px"
        bg="white"
        px="20px"
        pt="10px"
        pb="50px"
        mt="auto"
        mb="0"
        w="100%"
        left="unset"
        right="unset"
        maxW="500px"
        borderTop="1px solid #e1e1e1"
        zIndex={5}
      >
        <Like
          likeCount={likeCount}
          isLiked={isLiked}
          isLoading={isLikeLoading}
          onClick={async (e) => {
            await toggleLike(e)
            trackLike(trackLabels.nftDetail.like)
          }}
          my="auto"
        />

        <TranferOrBuy uuid={uuid} detail={detail} isClass={isClass} />
      </Flex>
      <Box h="94px" />
    </>
  )
}
