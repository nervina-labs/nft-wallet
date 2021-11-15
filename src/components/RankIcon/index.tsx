import styled from '@emotion/styled'
import { Box, BoxProps, FlexProps, Flex } from '@mibao-ui/components'
import { ReactComponent as TrophySvg } from '../../assets/svg/trophy.svg'

const RANK_COLORS = [
  `linear-gradient(
    300deg,
    #ffc635,
    rgb(205, 130, 15),
    #ffc635,
    rgb(205, 130, 15)
  )`,
  `linear-gradient(
    300deg,
    #ececec,
    #c9c9c9,
    #ececec,
    #c9c9c9
    )`,
  `linear-gradient(
    300deg,
    #d58e64,
    #eca378,
    #d58e64,
    #eca378
  )`,
]

const Bg = styled.div`
  position: absolute;
  background-image: ${(props: { rank?: number }) =>
    RANK_COLORS[props.rank ?? 0]};
  width: 100%;
  background-size: 300%, 300%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  animation: blink 3s ease infinite alternate;
  z-index: 0;
  border-radius: inherit;

  @keyframes blink {
    0% {
      background-position: 0, 50%;
    }

    50% {
      background-position: 100%, 50%;
    }

    100% {
      background-position: 0, 50%;
    }
  }
`

interface RankTopProps extends BoxProps {
  rank?: number
  icon?: 'trophy' | 'text'
}

interface RankIconProps extends FlexProps {
  rank?: number
  variant?: 'text' | 'trophy'
}

export const RankIcon: React.FC<RankIconProps> = ({
  rank,
  variant = 'text',
  ...flexProps
}) => {
  const realRank = typeof rank === 'number' ? (rank ?? 0) + 1 : ''

  return (
    <Flex
      position="relative"
      color="white"
      whiteSpace="nowrap"
      lineHeight="16px"
      fontWeight="600"
      py="4px"
      px="8px"
      rounded="full"
      overflow="hidden"
      justify="center"
      fontSize="12px"
      {...flexProps}
    >
      <Box position="relative" zIndex={1} display="inline-block">
        {variant === 'text' ? 'TOP' + realRank : ''}
        {variant === 'trophy' ? <TrophySvg /> : ''}
      </Box>
      {variant === 'trophy' && typeof rank === 'number' ? (
        <Box position="relative" zIndex={1} mx="3px">
          {rank + 1}
        </Box>
      ) : null}
      <Bg rank={rank} />
    </Flex>
  )
}

export const RankBorderBox: React.FC<RankTopProps> = ({
  rank,
  children,
  icon,
  ...boxProps
}) => {
  return (
    <Box position="relative" p="2px" {...boxProps}>
      {icon === 'text' ? (
        <RankIcon
          variant="text"
          position="absolute"
          top="-5px"
          left="50%"
          transform="translateX(-50%)"
          rank={rank}
          zIndex={2}
          py={0}
          px="3px"
          rounded="3px"
          fontSize="10px"
        />
      ) : null}
      {children}
      <Bg rank={rank} />
    </Box>
  )
}
