import { Box, Flex } from '@mibao-ui/components'
import { Switch } from '@chakra-ui/react'
import { Lite } from './components/lite'
import { useCallback } from 'react'
import { MainContainer } from '../../styles'
import { Pro } from './components/pro'
import { HiddenBar } from '../../components/HiddenBar'
import { useRouteQuerySearch } from '../../hooks/useRouteQuery'
import { useScrollRestoration } from '../../hooks/useScrollRestoration'

export const Explore: React.FC = () => {
  const [mode, setMode] = useRouteQuerySearch<'pro' | 'lite'>('mode', 'pro')
  const onChangeMode = useCallback(() => {
    setMode(mode === 'lite' ? 'pro' : 'lite')
  }, [mode, setMode])
  useScrollRestoration()

  return (
    <MainContainer>
      <Flex justify="space-between" pt="8px" pb="14px" h="50px" px="20px">
        <Box
          fontSize="24px"
          fontWeight="600"
          h="21px"
          lineHeight="21px"
          mt="auto"
        >
          mibao
        </Box>

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
      <HiddenBar />
    </MainContainer>
  )
}
