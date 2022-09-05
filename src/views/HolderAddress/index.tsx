import React from 'react'
import { Info } from '../Info'
import { Appbar, AppbarSticky } from '../../components/Appbar'
import { useParams } from 'react-router'
import { RainbowBackground } from '../../components/RainbowBackground'
import { Box, Center, Image } from '@chakra-ui/react'
import FullLogo from '../../assets/img/new-logo.png'

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
      <Center pb="50px" mt="auto">
        <Image src={FullLogo} w="auto" h="36px" />
      </Center>
    </RainbowBackground>
  )
}
