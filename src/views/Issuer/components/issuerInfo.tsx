import {
  Avatar,
  Box,
  Center,
  Grid,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Stack,
  Image,
} from '@mibao-ui/components'
import React, { useCallback, useMemo } from 'react'
import { useParams } from 'react-router'
import { useIssuerInfo } from '../hooks/useIssuerInfo'
import { isSupportWebp } from '../../../utils'
import { useTranslation } from 'react-i18next'
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
import styled from 'styled-components'
import { Redirect } from 'react-router-dom'
import { RoutePath } from '../../../routes'
import { HEADER_HEIGHT } from '../../../components/Appbar'

const IssuerIcon = styled.div`
  display: inline-block;
  background-image: linear-gradient(
    330deg,
    rgb(205, 130, 15),
    rgb(250, 190, 60)
  );
  color: white;
  border-radius: 5px;
  padding: 0 5px;
  margin: auto 0;
`

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

export const IssuerInfo: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation('translations')
  const { data, isLoading, error, failureCount } = useIssuerInfo(id)
  const gotoMetaUrl = useCallback((url: string) => {
    window.location.href = url
  }, [])
  const socialMediaIcons = useMemo(() => {
    return data?.social_media?.map((media, i) => (
      <Center
        w="30px"
        h="30px"
        rounded="100%"
        p="0"
        bg="var(--input-bg-color)"
        textAlign="center"
        lineHeight="30px"
        onClick={() => {
          gotoMetaUrl(media.url)
        }}
        key={i}
      >
        <img
          src={SocialMediaIconMap[media.social_type]}
          alt={media.social_type}
          width="15px"
        />
      </Center>
    ))
  }, [data?.social_media, gotoMetaUrl])

  if (error && failureCount >= 3) {
    return <Redirect to={RoutePath.NotFound} />
  }

  return (
    <Box py={`${HEADER_HEIGHT - 60}px`} pb="22px">
      <Image
        src={data?.cover_image_url === null ? '' : data?.cover_image_url}
        w="100%"
        h="200px"
        fallback={<Box h="80px" />}
        containerProps={{ w: '100%', h: 'auto' }}
      />
      <Stack spacing="16px" px="16px" mt="12px">
        <Grid templateColumns="60px calc(100% - 76px)" h="32px">
          <Box w="60px" position="relative">
            <Box position="absolute" bottom="0">
              <Avatar
                src={data?.avatar_url}
                isVerified={data?.verified_info?.is_verified}
                isBanned={data?.is_issuer_banned}
                size="60px"
                border="3px solid var(--input-bg-color)"
                resizeScale={100}
                webp={isSupportWebp()}
                customizedSize={{
                  fixed: 'small',
                }}
              />
            </Box>
          </Box>
          <Grid templateColumns="calc(100% - 80px) auto">
            <SkeletonText
              isLoaded={!isLoading}
              noOfLines={1}
              mx="16px"
              h="32px"
            >
              <Box
                color="#777E90"
                textOverflow="ellipsis"
                overflow="hidden"
                fontSize="12px"
                whiteSpace="nowrap"
                h="18px"
                my="auto"
              >
                <IssuerIcon>{t('common.creator')}</IssuerIcon>
                {data?.verified_info?.verified_title && (
                  <Box as="span" ml="6px">
                    {data?.verified_info?.verified_title}
                  </Box>
                )}
              </Box>
            </SkeletonText>
          </Grid>
        </Grid>

        <Box>
          <Skeleton isLoaded={!isLoading} w="200px" h="20px">
            <Box
              textOverflow="ellipsis"
              overflow="hidden"
              fontSize="16px"
              fontWeight="500"
              whiteSpace="nowrap"
            >
              {data?.name}
            </Box>
          </Skeleton>
          <Skeleton isLoaded={!isLoading} h="16px" mt="6px">
            {data?.issuer_id && <Address content={data?.issuer_id} />}
          </Skeleton>
        </Box>
        <SkeletonText isLoaded={!isLoading} noOfLines={3} spacing={4}>
          {data?.description ? (
            <Description content={data?.description} />
          ) : null}
        </SkeletonText>

        <Stack align="center" direction="row" justify="center">
          {isLoading && !socialMediaIcons && (
            <SkeletonCircle size="30px" isLoaded={!isLoading} />
          )}
          {socialMediaIcons}
        </Stack>
      </Stack>
    </Box>
  )
}
