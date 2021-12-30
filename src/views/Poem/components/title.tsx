import { Box, Image, List, ListItem } from '@chakra-ui/react'
import styled from '@emotion/styled'
import { ReactComponent as LogoSvg } from '../assets/logo.svg'
import { ReactComponent as MoonSvg } from '../assets/moon.svg'
import { ReactComponent as HomeTextSvg } from '../assets/home-text.svg'
import { ReactComponent as RankTextSvg } from '../assets/rank-text.svg'
import BannerTextSvgPath from '../assets/banner-text.svg'
import { ReactComponent as JointUnitSvg } from '../assets/joint-unit.svg'
import BgTextPath from '../assets/bg-text.png'
import { NFT_EXPLORER_URL } from '../../../constants'
import { EventState } from '../api.interface'

export const StyledMoonSvg = styled(MoonSvg)`
  top: 6px;
  z-index: 1;
  left: 50%;
  width: 258px;
  height: 258px;
  position: absolute;
  transition: 400ms;
  transform: translate(-20%, 0);
  &.center {
    transform: translate(-50%, 100px);
  }
`

export const StyledLogoSvg = styled(LogoSvg)`
  height: 25px;
  width: auto;
  top: 0;
  left: 20px;
  position: absolute;
  z-index: 3;
`

export const StyledJointUnitSvg = styled(JointUnitSvg)`
  top: 30px;
  position: absolute;
  left: 20px;
  transition: 200ms;
  &.hide {
    opacity: 0;
  }
`

export const StyledHomeTextSvg = styled(HomeTextSvg)`
  position: absolute;
  top: 120px;
  left: 20px;
  z-index: 3;
  transition: 200ms;
  &.hide {
    opacity: 0;
  }
`

export const StyledRuleBgSvg = styled(Box)`
  width: calc(100% - 40px);
  margin: 0 auto;
`

export const StyledRankTextSvg = styled(RankTextSvg)`
  position: absolute;
  margin-top: 20px;
  width: 80%;
  max-width: 250px;
  height: auto;
  left: 50%;
  z-index: 3;
  transition: 200ms;
  transform: translateX(-50%);
  top: 40px;
  &.hide {
    opacity: 0;
  }
`

export const Title: React.FC<{
  isRank?: boolean
  eventState?: EventState
  specialClassUuid?: string
  normalClassUuid?: string
}> = ({ isRank, eventState, specialClassUuid = '', normalClassUuid = '' }) => {
  return (
    <Box position="relative" transition="200ms">
      <Box position="relative" h="270px" overflow="hidden">
        <StyledLogoSvg />
        <StyledJointUnitSvg className={isRank ? 'hide' : ''} />
        <StyledMoonSvg className={isRank ? 'center' : ''} />
        <Image
          src={BgTextPath}
          position="absolute"
          top="60px"
          width="calc(100% + 40px)"
          height="auto"
          left="-20px"
          zIndex={2}
          transition="300ms"
          px="10px"
          style={{
            transform: `translateY(${isRank ? 120 : 0}px)`,
          }}
        />
        <StyledRankTextSvg className={isRank ? '' : 'hide'} />
        <StyledHomeTextSvg className={isRank ? 'hide' : ''} />
      </Box>
      <Box
        w="calc(100% - 40px)"
        mx="auto"
        py="15px"
        px="10px"
        border="2px solid #F5C57B"
        borderTop="6px solid #F5C57B"
        position="relative"
      >
        <Box
          position="absolute"
          top="-4px"
          left="0"
          w="100%"
          h="4px"
          bg="linear-gradient(90deg, #E9C081 0.96%, rgb(74 67 52) 100%)"
          zIndex={1}
        />
        <Box
          color="#F5C57B"
          fontSize="14px"
          mb="15px"
          fontWeight="bold"
          w="full"
          textAlign="center"
        >
          活动将采用 NFT 投票的方式评选出 2021 年度诗人
        </Box>
        <List fontSize="14px">
          <ListItem display="flex">
            <Box
              bg="linear-gradient(129.81deg, #FFFFFF 12.45%, rgba(255, 255, 255, 0) 84.78%)"
              w="12px"
              minW="12px"
              h="12px"
              lineHeight="12px"
              textAlign="center"
              fontSize="12px"
              rounded="full"
              mt="4px"
              mb="auto"
              mr="5px"
              color="#000"
            >
              1
            </Box>
            <Box>
              向参与本次活动的 339 名诗人发放 339 张
              <a
                href={`${NFT_EXPLORER_URL}/nft/${specialClassUuid}`}
                style={{
                  textDecoration: 'underline',
                }}
              >
                诗人 NFT 票
              </a>
              ，每张票的权重是 5 票
            </Box>
          </ListItem>
          <ListItem display="flex">
            <Box
              bg="linear-gradient(129.81deg, #FFFFFF 12.45%, rgba(255, 255, 255, 0) 84.78%)"
              w="12px"
              minW="12px"
              h="12px"
              lineHeight="12px"
              textAlign="center"
              fontSize="12px"
              rounded="full"
              mt="4px"
              mb="auto"
              mr="5px"
              color="#000"
            >
              2
            </Box>
            <Box>
              发行
              <a
                href={`${NFT_EXPLORER_URL}/nft/${normalClassUuid}`}
                style={{
                  textDecoration: 'underline',
                }}
              >
                普通 NFT 票
              </a>{' '}
              6000 张，每张票的权重是 1 票
            </Box>
          </ListItem>
        </List>
      </Box>
      <Box
        bg={`url(${BannerTextSvgPath})`}
        bgRepeat="no-repeat"
        bgSize="100% auto"
        fontSize="14px"
        color="#000"
        textAlign="center"
        w="230px"
        h="31px"
        lineHeight="26px"
        mx="auto"
        mt="15px"
      >
        {eventState === 'closed' ? '活动关闭' : '请投票支持您喜欢的诗人吧！'}
      </Box>
    </Box>
  )
}
