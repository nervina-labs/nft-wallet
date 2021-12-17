import { Box, Flex, Image } from '@chakra-ui/react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import EyePath from '../../assets/img/ios-pwa-guide-eye.png'
import { ReactComponent as PwaGuideAddSvg } from '../../assets/svg/ios-pwa-guide-add-icon.svg'
import { ReactComponent as PwaGuideShareSvg } from '../../assets/svg/ios-pwa-guide-share-icon.svg'
import styled from '@emotion/styled'
import { Button } from '@mibao-ui/components'
import { CloseIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'
import { isInStandaloneMode } from '../../utils'
import { IS_IPHONE, IS_SAFARI } from '../../constants'
import { useTranslation } from 'react-i18next'

const Tips = styled(Box)`
  svg {
    height: 20px;
    width: auto;
    display: inline-block;
    margin: 0 5px;
  }
`

export const PwaGuide: React.FC = () => {
  const { t } = useTranslation('translations')
  const [
    isClosedPwaGuideFromLocal,
    setIsClosedPwaGuideFromLocal,
  ] = useLocalStorage(
    'is_closed_ios_pwa_guide_from_local',
    !(!isInStandaloneMode() && IS_IPHONE && IS_SAFARI)
  )
  const [isClosedPwaGuide, setIsClosedPwaGuide] = useState(
    isClosedPwaGuideFromLocal
  )
  useEffect(() => {
    setIsClosedPwaGuide(isClosedPwaGuideFromLocal)
  }, [isClosedPwaGuideFromLocal])

  if (isClosedPwaGuide) {
    return null
  }

  return (
    <Flex
      position="fixed"
      bottom="90px"
      zIndex={10}
      w="80%"
      maxW="315px"
      left="50%"
      transform="translateX(-50%)"
      bg="#fff"
      rounded="22px"
      shadow="0 4px 20px rgb(168 193 221 / 50%)"
      px="15px"
      pt="30px"
      pb="10px"
      fontSize="14px"
      direction="column"
    >
      <CloseIcon
        position="absolute"
        top="15px"
        right="20px"
        w="10px"
        h="10px"
        onClick={() => setIsClosedPwaGuide(true)}
      />
      <Image
        src={EyePath}
        position="absolute"
        top="0"
        left="0"
        w="128px"
        transform="translate(-30px, -30px)"
      />
      {t('pwa-guide.desc')}
      <Tips fontWeight="300" mt="10px">
        <Box as="span" mr="10px">
          {t('pwa-guide.step-1')}
          <PwaGuideShareSvg />
        </Box>
        {t('pwa-guide.step-2.1')}
        <PwaGuideAddSvg />
        {t('pwa-guide.step-2.2')}
      </Tips>
      <Button
        variant="link"
        ml="auto"
        color="#616DD6"
        onClick={() => setIsClosedPwaGuideFromLocal(true)}
      >
        {t('pwa-guide.ok')}
      </Button>
    </Flex>
  )
}
