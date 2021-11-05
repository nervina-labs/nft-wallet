import { Box, Flex } from '@mibao-ui/components'
import { Switch } from '@chakra-ui/react'
import { Lite } from './components/lite'
import { useState } from 'react'
import { MainContainer } from '../../styles'
import { Pro } from './components/pro'

export const Explore: React.FC = () => {
  const [isLite, setIsLite] = useState(false)

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
            {isLite ? 'Lite' : 'Pro'}
          </Box>
          <Switch
            my="auto"
            id="is-lite"
            size="md"
            colorScheme="green"
            isChecked={isLite}
            onChange={() => setIsLite((v) => !v)}
          />
        </Flex>
      </Flex>

      {isLite ? <Lite /> : <Pro />}
    </MainContainer>
  )
}
