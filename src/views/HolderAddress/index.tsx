import React from 'react'
import { Info } from '../Info'
import { Appbar, AppbarSticky } from '../../components/Appbar'
import { useParams } from 'react-router'
import { ReactComponent as FullLogo } from '../../assets/svg/full-logo.svg'
import { RainbowBackground } from '../../components/RainbowBackground'
import { Box, Center } from '@chakra-ui/react'

export const HolderAddress: React.FC = () => {
  const { address } = useParams<{ address: string }>()
  return (
    <RainbowBackground
      minH="100vh"
      display="flex"
      flexDirection="column"
      style={{ height: 'auto' }}
    >
      <AppbarSticky mb="10%">
        <Appbar transparent />
      </AppbarSticky>
      <Box position="relative" zIndex={2} px="24px" pb="30px">
        <Info address={address} />
      </Box>
      <Center pb="20px" mt="auto">
        <FullLogo />
      </Center>
    </RainbowBackground>
  )
}
