import { Box, Flex, Grid, List, ListItem } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { ReactComponent as LogoSvg } from '../assets/logo.svg'
import { ReactComponent as MoonSvg } from '../assets/moon.svg'
import { ReactComponent as HomeTextSvg } from '../assets/home-text.svg'
import { ReactComponent as BgTextSvg } from '../assets/bg-text-en.svg'
import { ReactComponent as RankTextSvg } from '../assets/rank-text.svg'

export const StyledMoonSvg = styled(MoonSvg)`
  top: 6px;
  z-index: 1;
  left: 50%;
  width: 258px;
  height: 258px;
  position: absolute;
  transform: translateX(
    ${({ center }: { center?: boolean }) => (center ? '-50%' : '-20%')}
  );
  transition: 200ms;
`

export const StyledLogoSvg = styled(LogoSvg)`
  top: 0;
  left: 20px;
  position: absolute;
  z-index: 3;
`

export const StyledBgTextSvg = styled(BgTextSvg)`
  position: absolute;
  top: 200px;
  width: calc(100% - 40px);
  height: auto;
  left: 20px;
  z-index: 2;
`

export const StyledHomeTextSvg = styled(HomeTextSvg)`
  position: absolute;
  top: 29px;
  left: 20px;
  z-index: 3;
  transition: 200ms;
  opacity: ${({ hide }: { hide?: boolean }) => (hide ? 0 : 1)};
`

export const StyledRankTextSvg = styled(RankTextSvg)`
  position: absolute;
  margin-top: 50px;
  width: 80%;
  height: auto;
  left: 20px;
  z-index: 3;
  transition: 200ms;
  opacity: ${({ hide }: { hide?: boolean }) => (hide ? 0 : 1)};
`

export const Title: React.FC<{
  isRank?: boolean
}> = ({ isRank }) => {
  return (
    <Box position="relative">
      <Box position="relative" h={isRank ? '300px' : '340px'} overflow="hidden">
        <StyledLogoSvg />
        <StyledMoonSvg center={isRank} />
        <StyledBgTextSvg />
        <StyledRankTextSvg hide={!isRank} />
        <StyledHomeTextSvg hide={isRank} />
      </Box>
      {!isRank ? (
        <Grid
          templateColumns="51px calc(100% - 51px)"
          h="105px"
          mx="20px"
          position="relative"
          userSelect="none"
          _after={{
            content: '" "',
            w: '30px',
            h: '30px',
            bg: '#1a1a1a',
            position: 'absolute',
            left: '36px',
            rounded: 'full',
            top: '-15px',
          }}
          _before={{
            content: '" "',
            w: '30px',
            h: '30px',
            bg: '#1a1a1a',
            position: 'absolute',
            left: '36px',
            rounded: 'full',
            bottom: '-15px',
          }}
        >
          <Flex
            bg="#F5C57B"
            color="#484848"
            fontWeight="bold"
            fontSize="18px"
            textAlign="center"
            alignItems="center"
            justify="center"
          >
            <Box>
              规<br />则
            </Box>
          </Flex>
          <Flex
            direction="column"
            bg="#fff"
            py="8px"
            color="#000"
            textAlign="center"
            fontSize="14px"
            lineHeight="22px"
          >
            <Box fontSize="16px" fontWeight="600">
              本次诗歌节采用 NFT 进行投票
            </Box>
            <List w="160px" mx="auto" whiteSpace="nowrap">
              <ListItem
                position="relative"
                _before={{
                  content: '" "',
                  width: '5px',
                  height: '5px',
                  rounded: 'full',
                  display: 'block',
                  position: 'absolute',
                  top: 'calc(50% - 2.5px)',
                  left: '-10px',
                  bg: '#F5C57B',
                }}
              >
                投出一个诗人 NFT{' '}
                <Box as="span" color="#F5C57B">
                  计3票
                </Box>
              </ListItem>
              <ListItem
                position="relative"
                _before={{
                  content: '" "',
                  width: '5px',
                  height: '5px',
                  rounded: 'full',
                  display: 'block',
                  position: 'absolute',
                  top: 'calc(50% - 2.5px)',
                  left: '-10px',
                  bg: '#F5C57B',
                }}
              >
                投出一个普通 NFT{' '}
                <Box as="span" color="#F5C57B">
                  计1票
                </Box>
              </ListItem>
            </List>
            <Box>快去投出你喜欢的诗歌吧！</Box>
          </Flex>
        </Grid>
      ) : null}
    </Box>
  )
}
