import { Box, Flex, Image, Center } from '@chakra-ui/react'
import { useObservable } from 'rxjs-hooks'
import { fromEvent, scan, tap, throttleTime } from 'rxjs'
import EyePath from '../../assets/img/ios-pwa-guide-eye.png'
import { ReactComponent as PwaLogo } from '../../assets/svg/pwa-logo.svg'
import { ReactComponent as CloseSvg } from '../../assets/svg/close.svg'
import { ReactComponent as AddIcon } from '../../assets/svg/ios-pwa-guide-add-icon.svg'
import styled from '@emotion/styled'
import { Trans, useTranslation } from 'react-i18next'
import { usePwaGuide } from '../../hooks/usePwaGuide'
import { useState } from 'react'
import { IS_IPHONE } from '../../constants'

const Container = styled(Flex)`
  position: fixed;
  bottom: 0;
  height: 40px;
  align-items: center;
  z-index: 11;
  background-color: #fff;
  width: 100%;
  background-color: white;
  max-width: 500px;
  padding: 0 20px;
  transition: 300ms;

  &.hide {
    transform: translateY(50px);
  }
`

export const PwaGuide: React.FC = () => {
  const { t } = useTranslation('translations')
  const { isPwaInstalled, installPwa, isPwaInstallable } = usePwaGuide()
  const [isClose, setIsClose] = useState(false)

  const [isHide, setIsHide] = useState(false)
  useObservable(() =>
    fromEvent(window, 'scroll').pipe(
      throttleTime(200),
      scan((acc) => [acc[1], window.scrollY], [window.scrollY, window.scrollY]),
      tap(([prev, curr]) => {
        setIsHide(prev < curr && curr > 200)
      })
    )
  )

  if (isPwaInstalled || isClose || !isPwaInstallable) {
    return null
  }

  return (
    <Container className={!isHide ? 'hide' : ''}>
      <Image
        src={EyePath}
        position="absolute"
        bottom="10px"
        w="60px"
        left="3px"
      />
      <Box position="relative" mr="10px">
        <PwaLogo />
      </Box>
      <Center
        fontSize={IS_IPHONE ? '10px' : '12px'}
        color="#5065E5"
        onClick={installPwa}
        cursor={'pointer'}
      >
        {IS_IPHONE ? (
          <Trans
            ns="translations"
            i18nKey="pwa-guide.ios"
            t={t}
            components={{
              comp: <AddIcon />,
            }}
          />
        ) : (
          t('pwa-guide.android')
        )}
      </Center>
      <Box marginLeft="auto" cursor="pointer" onClick={() => setIsClose(true)}>
        <CloseSvg />
      </Box>
    </Container>
  )
}
