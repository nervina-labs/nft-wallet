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

  const orderOnClick = useCallback(() => {
    if (!detail?.product_on_sale_uuid) {
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
    })
    openOrderDrawer()
  }, [detail, setProductId, setProductInfo, openOrderDrawer])

  const isSoldout = Number(detail?.product_count) === 0

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
