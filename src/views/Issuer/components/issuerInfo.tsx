import {
  Avatar,
  Box,
  Center,
  Flex,
  Skeleton,
  SkeletonText,
  Stack,
} from '@mibao-ui/components'
import React from 'react'
import { useParams } from 'react-router'
import { useIssuerInfo } from '../hooks/useIssuerInfo'
import { Follow } from '../../../components/Follow'
import { formatCount } from '../../../utils'
import { useTranslation } from 'react-i18next'

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

  return (
    <Stack py="22px" px="16px" spacing="16px">
      <Flex>
        <Box w="76px">
          <Avatar
            src={data?.avatar_url}
            isVerified={data?.verified_info?.is_verified}
            isBanned={data?.is_issuer_banned}
            size="60px"
            border="3px solid var(--input-bg-color)"
          />
        </Box>
        <Box w="calc(100% - 170px)" mr="16px">
          <SkeletonText
            isLoaded={!isLoading}
            noOfLines={2}
            spacing={4}
            mt="10px"
          >
            <Box
              textOverflow="ellipsis"
              overflow="hidden"
              fontSize="16px"
              fontWeight="500"
              whiteSpace="nowrap"
            >
              {data?.name}
            </Box>
            <Box
              textOverflow="ellipsis"
              overflow="hidden"
              fontSize="12px"
              whiteSpace="nowrap"
            >
              {/* TODO: Add automatic width abbreviation */}
              ID: {data?.issuer_id}
            </Box>
          </SkeletonText>
        </Box>
        <Center w="80px">
          <Skeleton isLoaded={!isLoading} borderRadius="12px">
            <Follow
              followed={data?.issuer_followed === true}
              uuid={id}
              afterToggle={refetch}
            />
          </Skeleton>
        </Center>
      </Flex>
      <SkeletonText isLoaded={!isLoading} noOfLines={3} spacing={4}>
        <Box w="100%" fontSize="13px" pt="8px">
          <Box w="100%">{data?.description}</Box>
        </Box>
      </SkeletonText>
      <Skeleton isLoaded={!isLoading} borderRadius="22px">
        <FollowerWithLike
          likes={data?.issuer_likes ?? 0}
          follows={data?.issuer_follows ?? 0}
        />
      </Skeleton>
    </Stack>
  )
}
