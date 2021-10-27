import {
  Avatar,
  Box,
  Center,
  Flex,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from '@mibao-ui/components'
import React, { useCallback, useEffect } from 'react'
import { useParams } from 'react-router'
import { useIssuerInfo } from '../hooks/useIssuerInfo'
import { Follow } from '../../../components/Follow'
import { formatCount } from '../../../utils'
import { useTranslation } from 'react-i18next'
import WebsiteSvg from '../../../assets/svg/issuer-website.svg'
import { atom, useAtom } from 'jotai'
import { SocialMediaType } from '../../../models/issuer'
import { Description } from './description'
import { Address } from './address'

export const TabCountInfo = atom({
  onSaleProductCount: 0,
  issuedClassCount: 0,
})

const SocialMediaIconMap: { [key in SocialMediaType]: string } = {
  weibo: WebsiteSvg,
  bilibili: WebsiteSvg,
  douyin: WebsiteSvg,
  behance: WebsiteSvg,
  github: WebsiteSvg,
  facebook: WebsiteSvg,
  instagram: WebsiteSvg,
  twitter: WebsiteSvg,
}

const FollowerWithLike: React.FC<{
  follows: number
  likes: number
}> = ({ follows, likes }) => {
  const { t, i18n } = useTranslation('translations')
  return (
    <Flex bg="var(--input-bg-color)" h="88px" borderRadius="22px">
      <Stack h="60px" my="auto" w="50%" spacing={0}>
        <Center fontSize="24px">{formatCount(follows, i18n.language)}</Center>
        <Center color="var(--secondary-font-color)" fontSize="14px">
          {t('issuer.follower')}
        </Center>
      </Stack>
      <Box h="64px" bg="#e1e1e1" w="1px" my="auto" />
      <Stack h="60px" my="auto" w="50%" spacing={0}>
        <Center fontSize="24px">{formatCount(likes, i18n.language)}</Center>
        <Center color="var(--secondary-font-color)" fontSize="14px">
          {t('issuer.like')}
        </Center>
      </Stack>
    </Flex>
  )
}

export const IssuerInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data, refetch, isLoading } = useIssuerInfo(id)
  const gotoMetaUrl = useCallback((url: string) => {
    window.location.href = url
  }, [])
  const [, setTabCountInfo] = useAtom(TabCountInfo)

  useEffect(() => {
    if (data && !isLoading) {
      setTabCountInfo({
        onSaleProductCount: data.on_sale_product_count ?? 0,
        issuedClassCount: data.issued_class_count ?? 0,
      })
    }
  }, [data, isLoading, setTabCountInfo])

  return (
    <Stack py="22px" px="16px" spacing="16px">
      <Flex>
        <Box w="60px" mr="16px">
          <Avatar
            src={data?.avatar_url}
            isVerified={data?.verified_info?.is_verified}
            isBanned={data?.is_issuer_banned}
            size="60px"
            border="3px solid var(--input-bg-color)"
          />
        </Box>
        <Box w="calc(100% - 76px - 76px)" mr="16px">
          <SkeletonText isLoaded={!isLoading} noOfLines={3} spacing={2}>
            <Box
              textOverflow="ellipsis"
              overflow="hidden"
              fontSize="16px"
              fontWeight="500"
              whiteSpace="nowrap"
            >
              {data?.name}
            </Box>
            {data?.issuer_id && <Address content={data?.issuer_id} />}
            <Box
              color="#777E90"
              textOverflow="ellipsis"
              overflow="hidden"
              fontSize="12px"
              whiteSpace="nowrap"
            >
              {data?.verified_info?.verified_title}
            </Box>
          </SkeletonText>
        </Box>
        <Center>
          <Skeleton isLoaded={!isLoading} borderRadius="12px">
            <Follow
              followed={data?.issuer_followed === true}
              uuid={id}
              afterToggle={refetch}
              isPrimary
            />
          </Skeleton>
        </Center>
      </Flex>
      <SkeletonText isLoaded={!isLoading} noOfLines={3} spacing={4}>
        {data?.description && <Description content={data?.description} />}
      </SkeletonText>
      <Skeleton isLoaded={!isLoading} borderRadius="22px">
        <FollowerWithLike
          likes={data?.issuer_likes ?? 0}
          follows={data?.issuer_follows ?? 0}
        />
      </Skeleton>

      <Stack align="center" direction="row" justify="center">
        {data?.social_media?.map((media) => (
          <SkeletonCircle size="30px" isLoaded={!isLoading}>
            <Center
              w="30px"
              h="30px"
              rounded="100%"
              p="0"
              bg="var(--input-bg-color)"
              textAlign="center"
              lineHeight="30px"
              onClick={() => gotoMetaUrl(media.url)}
            >
              <img
                src={SocialMediaIconMap[media.socia_type]}
                alt="website"
                width="15px"
              />
            </Center>
          </SkeletonCircle>
        ))}
      </Stack>
    </Stack>
  )
}
