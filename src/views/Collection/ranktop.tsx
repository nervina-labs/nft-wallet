import { Flex, Image, Box } from '@mibao-ui/components'
import React from 'react'
import { Link } from 'react-router-dom'
import { RankBorderBox, RankIcon } from '../../components/RankIcon'
import { isSupportWebp } from '../../utils'

export const RankTop: React.FC<{
  bgImageUrl: string
  name: string
  rank: number
  uuid: string
}> = ({ bgImageUrl, name, uuid, rank = 0 }) => {
  const size = rank === 0 ? '90px' : '70px'
  return (
    <Link to={`/class/${uuid}`}>
      <Flex direction="column" w="105px" mt="auto" h="full" justify="end">
        <RankBorderBox
          shadow="0 6px 10px rgba(0, 0, 0, 0.2)"
          width={`calc(${size} + 4px)`}
          height={`calc(${size} + 4px)`}
          rounded="20%"
          mx="auto"
          mt="auto"
          rank={rank}
        >
          <Image
            w={size}
            h={size}
            rounded="20%"
            resizeScale={100}
            webp={isSupportWebp()}
            src={bgImageUrl === null ? '' : bgImageUrl}
          />
        </RankBorderBox>
        <Box
          fontSize={rank === 0 ? '14px' : '12px'}
          w="full"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          textAlign="center"
          my="10px"
        >
          {name}
        </Box>
        <Box mx="auto">
          <RankIcon rank={rank} variant="trophy" />
        </Box>
      </Flex>
    </Link>
  )
}
