import { Button, Center, Flex, Box } from '@mibao-ui/components'
import React from 'react'
import styled from 'styled-components'

export interface AppbarProps extends React.RefAttributes<HTMLDivElement> {
  title: React.ReactNode
  left?: React.ReactNode
  right?: React.ReactNode
  back?: boolean
  transparent?: boolean
}

export const HEADER_HEIGHT = 50

export const Appbar: React.ForwardRefExoticComponent<AppbarProps> = React.forwardRef(
  ({ title, left, right, transparent }, ref) => {
    return (
      <Flex
        maxW="500px"
        w="100%"
        position="relative"
        justifyContent="space-between"
        bg={transparent ? undefined : '#fff'}
        px={'20px'}
        ref={ref}
      >
        {left}
        <Center h={`${HEADER_HEIGHT}px`} fontSize="18px">
          {title}
        </Center>
        {right}
      </Flex>
    )
  }
)

export const AppbarSticky: React.FC<{ top?: number }> = ({
  children,
  top = 0,
}) => {
  return (
    <Box position="sticky" top={top} zIndex={100}>
      {children}
    </Box>
  )
}

const AppbarButtonContainer = styled.span`
  img,
  svg {
    width: 20px;
    height: auto;
    max-width: 20px;
    max-height: 20px;
  }
`

export const AppbarButton: React.FC<{
  transparent?: boolean
}> = ({ children, transparent }) => {
  return (
    <Button
      w={`${HEADER_HEIGHT}px`}
      h={`${HEADER_HEIGHT}px`}
      borderRadius="100%"
      variant="link"
      bg={transparent ? undefined : '#f6f8fA'}
    >
      <AppbarButtonContainer>{children}</AppbarButtonContainer>
    </Button>
  )
}
