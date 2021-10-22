import {
  Button,
  Center,
  Flex,
  Box,
  BoxProps,
  ButtonProps,
} from '@mibao-ui/components'
import React from 'react'
import styled from 'styled-components'
import { useHistoryBack } from '../../hooks/useHistoryBack'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'

export interface AppbarProps extends React.RefAttributes<HTMLDivElement> {
  title?: React.ReactNode
  left?: React.ReactNode
  right?: React.ReactNode
  back?: boolean
  transparent?: boolean
}

export interface AppbarButtonProps extends ButtonProps {
  transparent?: boolean
}

export interface AppbarStickyProps extends BoxProps {
  top?: number
  zIndex?: number
}

export const HEADER_HEIGHT = 60

export const Appbar: React.ForwardRefExoticComponent<AppbarProps> = React.forwardRef(
  ({ title, left, right, transparent }, ref) => {
    const back = useHistoryBack()
    const leftEl = left ?? (
      <AppbarButton onClick={() => back()}>
        <BackSvg />
      </AppbarButton>
    )
    return (
      <Flex
        maxW="500px"
        w="100%"
        h={`${HEADER_HEIGHT}px`}
        position="relative"
        justifyContent="space-between"
        alignItems="center"
        bg={transparent ? undefined : '#fff'}
        px="20px"
        ref={ref}
        boxSizing="border-box"
      >
        {leftEl}
        {title ? (
          <Center h={`${HEADER_HEIGHT}px`} fontSize="18px">
            {title}
          </Center>
        ) : null}
        {right}
      </Flex>
    )
  }
)

export const AppbarSticky: React.FC<AppbarStickyProps> = ({
  children,
  top = 0,
  zIndex = 100,
}) => {
  return (
    <Box position="sticky" top={top} zIndex={zIndex}>
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

export const AppbarButton: React.FC<AppbarButtonProps> = ({
  children,
  transparent,
  onClick,
  ...buttonProps
}) => {
  return (
    <Button
      onClick={onClick}
      w={`${HEADER_HEIGHT - 20}px`}
      height={`${HEADER_HEIGHT - 20}px`}
      borderRadius="100%"
      variant="link"
      bg={transparent ? undefined : '#f6f8fA'}
      {...buttonProps}
    >
      <AppbarButtonContainer>{children}</AppbarButtonContainer>
    </Button>
  )
}
