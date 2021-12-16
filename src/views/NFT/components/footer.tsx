/* eslint-disable @typescript-eslint/no-unused-vars */
import { Box, Drawer, Grid, Like, useDisclosure } from '@mibao-ui/components'
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
import { CONTAINER_MAX_WIDTH, IS_WEXIN } from '../../../constants'
import { RoutePath } from '../../../routes'
import { UnipassConfig } from '../../../utils'
import { Query } from '../../../models'
import { useQuery } from 'react-query'
import { trackLabels, useTrackClick } from '../../../hooks/useTrack'
import { useInnerSize } from '../../../hooks/useInnerSize'
import { Button } from '@chakra-ui/react'

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
  const isTokenClassExternalProductInfoEnable =
    isClass && detail && !detail?.product_price

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
  const { data: tokenClassExternalProductInfo } = useQuery(
    [Query.TokenClassExternalProductInfo, api, uuid],
    async () => {
      const { data } = await api.getTokenClassExternalProductInfo(uuid)
      return data
    },
    {
      enabled: isTokenClassExternalProductInfoEnable,
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
  const {
    isOpen: isOpenExternalProductLinkDialog,
    onOpen: onOpenExternalProductLinkDialog,
    onClose: onCloseExternalProductLinkDialog,
  } = useDisclosure()
  const { width } = useInnerSize()
  if (isTokenClassExternalProductInfoEnable && tokenClassExternalProductInfo) {
    return (
      <>
        <Drawer
          placement="bottom"
          isOpen={isOpenExternalProductLinkDialog}
          onClose={onCloseExternalProductLinkDialog}
          hasCloseBtn
          hasOverlay
          contentProps={{
            w: '100%',
            pt: '60px',
            pb: 'calc(10px + var(--safe-area-inset-bottom))',
            style: {
              left: `calc(50% - calc(${Math.min(
                width,
                CONTAINER_MAX_WIDTH
              )}px / 2))`,
              transform: 'translateX(0px) translateY(-50%) translateZ(0px)',
              maxWidth: `${CONTAINER_MAX_WIDTH}px`,
              borderRadius: '20px 20px 0 0',
            },
          }}
        >
          <Box textAlign="center" fontSize="18px">
            {t('nft.external-product.upcoming-visit')}
          </Box>
          <Box bg="#F6F9FC" fontSize="12px" p="12px" my="15px">
            {tokenClassExternalProductInfo.url}
          </Box>
          <Box fontSize="12px" color="primary.600" textAlign="center">
            {t('nft.external-product.not-official-website')}
          </Box>
          <Button
            variant="solid"
            isFullWidth
            colorScheme="primary"
            size="lg"
            mt="30px"
          >
            {t('nft.external-product.go-to-link')}
          </Button>
        </Drawer>
        {tokenClassExternalProductInfo?.price ? (
          <Box
            as="span"
            color="primary.600"
            fontSize="12px"
            h="40px"
            lineHeight="40px"
            mr="5px"
          >
            ¥{tokenClassExternalProductInfo.price}
          </Box>
        ) : null}
        <Button
          as="a"
          colorScheme="primary"
          variant="solid"
          my="auto"
          mr="0"
          fontWeight="normal"
          fontSize="14px"
          onClick={onOpenExternalProductLinkDialog}
          href={tokenClassExternalProductInfo?.url}
          target="_blank"
          cursor="pointer"
        >
          {t('nft.go-to-see')}
        </Button>
      </>
    )
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
      <Grid
        templateColumns="calc(100% - 120px) 120px"
        position="fixed"
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
      </Grid>
      <Box h="94px" />
    </>
  )
}
