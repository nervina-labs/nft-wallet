import { Avatar, Box, Center, Flex, Grid, Skeleton } from '@mibao-ui/components'
import { NFTDetail } from '../../../models'
import { TokenClass } from '../../../models/class-list'
import { ReactComponent as OwnedSealSvg } from '../../../assets/svg/owned-seal.svg'
import styled from 'styled-components'
import { Follow } from '../../../components/Follow'

const NftDetailName = styled.div`
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  font-size: 18px;
  -webkit-line-clamp: 2;
  margin-right: 10px;
`

export const NftDetail: React.FC<{
  detail?: NFTDetail | TokenClass
  isLoading: boolean
  refetch: (params?: any) => Promise<any>
}> = ({ detail, isLoading, refetch }) => {
  return (
    <Box p="20px">
      <Flex justifyContent={'space-between'}>
        <NftDetailName>{detail?.name}</NftDetailName>
        <Center w="50px">
          <OwnedSealSvg />
        </Center>
      </Flex>

      <Grid templateColumns="48px calc(100% - 48px - 80px) 80px" mt="25px">
        <Avatar
          src={detail?.issuer_info?.avatar_url}
          size="48px"
          border="3px solid var(--input-bg-color)"
        />

        <Box ml="18px">
          <Box
            fontSize="14px"
            textOverflow="ellipsis"
            whiteSpace="nowrap"
            overflow="hidden"
            fontWeight="500"
          >
            {detail?.issuer_info?.name}
          </Box>
          <Box fontSize="12px">{detail?.verified_info?.verified_title}</Box>
        </Box>

        <Center>
          <Skeleton isLoaded={!isLoading} borderRadius="12px">
            <Follow
              followed={detail?.issuer_info?.issuer_followed === true}
              uuid={detail?.issuer_info?.uuid ?? ''}
              afterToggle={refetch}
              isPrimary
            />
          </Skeleton>
        </Center>
      </Grid>
    </Box>
  )
}
