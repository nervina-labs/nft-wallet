import { Box, BoxProps } from '@chakra-ui/react'
import styled from '@emotion/styled'
import React from 'react'
import { MainContainer } from '../../styles'

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  position: relative;
  background: linear-gradient(192.04deg, #e2e3ff 50.5%, #eadeff 100%);
`

const Circular = styled(Box)`
  animation: run
    ${(props: { speed?: number }) => (props.speed ? props.speed : 5)}s ease
    infinite alternate;

  @keyframes run {
    0% {
      transform: translateX(0);
    }

    50% {
      transform: translateX(50%);
    }

    100% {
      transform: translateX(-50%);
    }
  }
`

export const RainbowBackground: React.FC<BoxProps> = ({
  children,
  ...props
}) => {
  return (
    <Container {...props}>
      <Circular
        position="absolute"
        top="20px"
        right="20%"
        w="166px"
        h="166px"
        bg="#FFA4E0"
        filter="blur(70px)"
        zIndex={1}
      />
      <Box
        position="absolute"
        top="10px"
        left="20%"
        w="214px"
        h="214px"
        bg="#FFEB90"
        filter="blur(120px)"
        speed={10}
        zIndex={1}
      />
      {children}
    </Container>
  )
}
