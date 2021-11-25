/* eslint-disable @typescript-eslint/indent */
import React, { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  BlindRewardInfo,
  CustomRewardInfo,
  isCustomReward,
  isNormalReward,
  NormalRewardInfo,
  RewardInfo,
} from '../../models/redeem'
import { NFTCard } from './NFTCard'
import {
  Box,
  Flex,
  Preview,
  Image,
  useDisclosure,
  AspectRatio,
} from '@mibao-ui/components'
import FALLBACK from '../../assets/img/nft-fallback.png'
import { isSupportWebp } from '../../utils'

export interface PriceCardProps {
  info: RewardInfo
  count: number
}

export interface NftPriceCardProps {
  info: NormalRewardInfo
  count: number
}

export const PriceCard: React.FC<NftPriceCardProps> = ({ info, count }) => {
  const [t] = useTranslation('translations')
  return (
    <Flex justify="space-between" mb="6px" mr="6px">
      <NFTCard info={info} />
      <Box fontSize="12px" ml="4px" lineHeight="50px">
        {t('exchange.count', { count })}
      </Box>
    </Flex>
  )
}

export interface PriceProps {
  prizes: RewardInfo
  showLabel?: boolean
}

export const Prize: React.FC<PriceProps> = ({ prizes, showLabel = true }) => {
  return isCustomReward(prizes) ? (
    <OtherPrice prizes={prizes} showLabel={showLabel} />
  ) : (
    <NFTPrice prizes={prizes} showLabel={showLabel} />
  )
}

export interface NFTPriceProps extends PriceProps {
  prizes: NormalRewardInfo[] | BlindRewardInfo
}

export const NFTPrice: React.FC<NFTPriceProps> = ({ prizes, showLabel }) => {
  const [t] = useTranslation('translations')
  const tokens = useMemo(
    () => (isNormalReward(prizes) ? prizes : prizes.options),
    [prizes]
  )
  const desc = isNormalReward(prizes)
    ? t('exchange.nft-prize')
    : t('exchange.blind-prize', {
        count: prizes.every_box_reward_count as any,
      })
  return (
    <Box px={showLabel ? '20px' : undefined}>
      {showLabel ? (
        <Box color="#5065E5" fontSize="12px" mb="15px" fontWeight="500">
          {desc}
        </Box>
      ) : null}
      {tokens.map((info, i) => (
        <PriceCard info={info} count={info.item_count} key={i} />
      ))}
    </Box>
  )
}

export interface OtherPriceProps extends PriceProps {
  prizes: CustomRewardInfo
}

export const OtherPrice: React.FC<OtherPriceProps> = ({
  prizes,
  showLabel,
}) => {
  const [t] = useTranslation('translations')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [previewImage, setPreviewImage] = useState('')
  return (
    <Box>
      <Preview
        isOpen={isOpen}
        onClose={onClose}
        renderer={previewImage}
        bgImgUrl={previewImage}
        type="image"
        render3D={() => null}
      />
      {showLabel ? (
        <Box
          bg="#E5E8FA"
          fontSize="12px"
          mb="15px"
          fontWeight="500"
          px="16px"
          py="8px"
          rounded="8px"
          mx="20px"
        >
          {t('exchange.other-prize')}
        </Box>
      ) : null}
      <Box fontSize="14px" mb="8px" mx={showLabel ? '20px' : undefined}>
        {prizes.reward_name}
      </Box>
      <Box
        fontSize="12px"
        color="#666666"
        mb="16px"
        whiteSpace="pre-line"
        mx={showLabel ? '20px' : undefined}
      >
        {prizes.reward_description}
      </Box>
      <Flex
        overflowX="auto"
        minW="140px"
        h="140px"
        overflowY="hidden"
        ml={showLabel ? '20px' : undefined}
      >
        {prizes.images.map((image, i) => (
          <AspectRatio
            key={i}
            radio={1 / 1}
            minW="140px"
            h="140px"
            mr="8px"
            resizeScale={300}
            webp={isSupportWebp()}
            fallbackSrc={FALLBACK}
            onClick={() => {
              setPreviewImage(image)
              onOpen()
            }}
          >
            <Image
              src={image}
              rounded="8px"
              w="full"
              h="full"
              resizeScale={300}
              webp={isSupportWebp()}
              fallbackSrc={FALLBACK}
            />
          </AspectRatio>
        ))}
      </Flex>
    </Box>
  )
}
