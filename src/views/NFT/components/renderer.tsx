import { NFTDetail } from '../../../models'
import Tilt from 'react-better-tilt'
import styled from 'styled-components'
import { HEADER_HEIGHT } from '../../../components/Appbar'
import { Box, Center, Flex, Image } from '@mibao-ui/components'
import { TokenClass } from '../../../models/class-list'
import { ReactComponent as CardbackSvg } from '../../../assets/svg/card-back.svg'
import { useTranslation } from 'react-i18next'

const TiltContainer = styled(Tilt)`
  position: relative;
  max-width: calc(100% - 60px);
  aspect-ratio: 1/1;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  margin: auto;
  max-height: 340px;

  &.disabled {
    transform: none !important;
  }
`

export const Renderer: React.FC<{ detail?: NFTDetail | TokenClass }> = ({
  detail,
}) => {
  const { t } = useTranslation('translations')

  return (
    <Box
      mt={`-${HEADER_HEIGHT}px`}
      bg="gray.200"
      h="460px"
      w="100%"
      pt={`${HEADER_HEIGHT + 10}px`}
      position="relative"
      overflow="hidden"
    >
      <TiltContainer
        adjustGyroscope
        gyroscope
        tiltEnable
        transitionSpeed={1000}
      >
        <Flex>
          <Image
            maxH="300px"
            src={detail?.bg_image_url}
            rounded="30px"
            opacity={!detail?.bg_image_url ? 0 : 1}
            resizeScale={400}
            m="auto"
            webp
          />
        </Flex>
      </TiltContainer>

      <Box position="absolute" top={0} left={0} w="100%" h="100%" zIndex={0}>
        <Image
          src={detail?.bg_image_url}
          w="110%"
          h="110%"
          resizeScale={400}
          opacity={0.8}
          webp
          transform="translate(-5%, -5%)"
          filter="blur(50px) contrast(1.2)"
        />
      </Box>

      <Center position="absolute" bottom="20px" w="full" transition="0.2s">
        <Center
          zIndex={2}
          position="relative"
          color="white"
          fontSize="12px"
          bg="rgba(0, 0, 0, 0.4)"
          rounded="8px"
          pr="6px"
        >
          <CardbackSvg />
          {t('nft.show-card-back')}
        </Center>
      </Center>
    </Box>
  )
}
