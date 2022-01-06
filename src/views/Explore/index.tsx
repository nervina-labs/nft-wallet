import { Box, Flex } from '@mibao-ui/components'
import { Switch, Image as RowImage } from '@chakra-ui/react'
import { Lite } from './components/lite'
import { useCallback } from 'react'
import { MainContainer } from '../../styles'
import { Pro } from './components/pro'
import { HiddenBarFill } from '../../components/HiddenBar'
import { useRouteQuerySearch } from '../../hooks/useRouteQuery'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'
import LogoPath from '../../assets/svg/explore-logo.svg'
import { useTrackEvent, useTrackDidMount } from '../../hooks/useTrack'

export const Explore: React.FC = () => {
  const [mode, setMode] = useRouteQuerySearch<'pro' | 'lite'>('mode', 'pro')
  const clickLite = useTrackEvent('explore', 'click', 'Lite')
  const onChangeMode = useCallback(() => {
    setMode(mode === 'lite' ? 'pro' : 'lite')
    if (mode !== 'lite') {
      clickLite()
    }
  }, [mode, setMode, clickLite])
  useScrollRestoration()

  useTrackDidMount('explore')

  return (
    <MainContainer>
      <Flex justify="space-between" pt="18px" pb="8px" h="60px" px="20px">
        <RowImage src={LogoPath} h="21px" w="auto" my="auto" />

        <Flex mt="auto">
          <Box as="span" mr="10px" fontSize="14px" fontWeight="600">
            {mode === 'lite' ? 'Lite' : 'Pro'}
          </Box>
          <Switch
            my="auto"
            id="is-lite"
            size="md"
            colorScheme="green"
            isChecked={mode === 'lite'}
            onChange={onChangeMode}
          />
        </Flex>
      </Flex>

      {mode === 'lite' ? <Lite /> : <Pro />}
      <HiddenBarFill />
    </MainContainer>
  )
}
