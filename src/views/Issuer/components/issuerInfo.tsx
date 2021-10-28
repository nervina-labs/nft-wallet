import {
  Avatar,
  Box,
  Center,
  Flex,
  Grid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
} from '@mibao-ui/components'
import React, { useCallback, useEffect, useMemo } from 'react'
import { useParams } from 'react-router'
import { useIssuerInfo } from '../hooks/useIssuerInfo'
import { Follow } from '../../../components/Follow'
import { formatCount } from '../../../utils'
import { useTranslation } from 'react-i18next'
import { atom, useAtom } from 'jotai'
import { SocialMediaType } from '../../../models/issuer'
import { Description } from './description'
import { Address } from './address'
import WeiboSvg from '../../../assets/svg/issuer-weibo.svg'
import BiliBiliSvg from '../../../assets/svg/issuer-bilibili.svg'
import DouyinSvg from '../../../assets/svg/issuer-douyin.svg'
import BehanceSvg from '../../../assets/svg/issuer-behance.svg'
import GithubSvg from '../../../assets/svg/issuer-github.svg'
import FacebookSvg from '../../../assets/svg/issuer-facebook.svg'
import InstagramSvg from '../../../assets/svg/issuer-instagram.svg'
import TwitterSvg from '../../../assets/svg/issuer-twitter.svg'

export const TabCountInfo = atom({
  onSaleProductCount: 0,
  issuedClassCount: 0,
})

const SocialMediaIconMap: { [key in SocialMediaType]: string } = {
  weibo: WeiboSvg,
  bilibili: BiliBiliSvg,
  douyin: DouyinSvg,
  behance: BehanceSvg,
  github: GithubSvg,
  facebook: FacebookSvg,
  instagram: InstagramSvg,
  twitter: TwitterSvg,
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
  const socialMediaIcons = useMemo(() => {
    return data?.social_media?.map((media) => (
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
    ))
  }, [data?.social_media, gotoMetaUrl])

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
      <Grid templateColumns="60px calc(100% - 76px - 80px) auto">
        <Box w="60px">
          <Avatar
            src={data?.avatar_url}
            isVerified={data?.verified_info?.is_verified}
            isBanned={data?.is_issuer_banned}
            size="60px"
            border="3px solid var(--input-bg-color)"
          />
        </Box>
        <Box mx="16px">
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
        <Flex justifyContent="flex-end">
          <Skeleton isLoaded={!isLoading} borderRadius="12px" my="auto">
            <Follow
              followed={data?.issuer_followed === true}
              uuid={id}
              afterToggle={refetch}
              isPrimary
            />
          </Skeleton>
        </Flex>
      </Grid>
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
        {isLoading && !socialMediaIcons && (
          <SkeletonCircle size="30px" isLoaded={!isLoading} />
        )}
        {socialMediaIcons}
      </Stack>
    </Stack>
  )
}
