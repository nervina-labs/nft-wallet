import { Flex, Image, Box } from '@mibao-ui/components'
import React from 'react'
import { Link } from 'react-router-dom'
import { ReactComponent as TrophySvg } from '../../assets/svg/trophy.svg'
import { TokenClass } from '../../models/class-list'

export const RankTop: React.FC<{
  tokenClass: TokenClass
  rank: number
}> = ({ tokenClass, rank = 0 }) => {
  const size = rank === 0 ? '90px' : '70px'

  return (
    <Link to={`/class/${tokenClass.uuid}`}>
      <Flex direction="column" w="105px" mt="auto" h="full" justify="end">
        <Image
          w={size}
          h={size}
          rounded="20%"
          src={tokenClass.bg_image_url === null ? '' : tokenClass.bg_image_url}
          containerProps={{
            className: `top-border r-${rank}`,
            rounded: '20%',
            overflow: 'hidden',
            width: `calc(${size} + 4px)`,
            height: `calc(${size} + 4px)`,
            p: '2px',
            mx: 'auto',
            shadow: '0 6px 10px rgba(0, 0, 0, 0.2)',
            mt: 'auto',
          }}
        />
        <Box
          fontSize="14px"
          w="full"
          textOverflow="ellipsis"
          overflow="hidden"
          whiteSpace="nowrap"
          textAlign="center"
          my="10px"
        >
          {tokenClass.name}
        </Box>
        <Box
          className={`top-border r-${rank}`}
          mx="auto"
          display="inline-flex"
          rounded="100px"
          overflow="hidden"
          px="6px"
          py="4px"
          h="24px"
        >
          <TrophySvg />
          <Flex
            as="span"
            color="white"
            whiteSpace="nowrap"
            lineHeight="16px"
            position="relative"
            zIndex="2"
            fontSize="12px"
            fontWeight="600"
            mx="5px"
          >
            {rank + 1}
          </Flex>
        </Box>
      </Flex>
    </Link>
  )
}
