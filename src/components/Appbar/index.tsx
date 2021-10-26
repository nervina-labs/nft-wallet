import {
  Button,
  Center,
  Box,
  BoxProps,
  ButtonProps,
  Grid,
} from '@mibao-ui/components'
import React from 'react'
import styled from 'styled-components'

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
    return (
      <Grid
        maxW="500px"
        w="100%"
        h={`${HEADER_HEIGHT}px`}
        position="relative"
        templateColumns={'60px calc(100% - 120px) 60px'}
        bg={transparent ? undefined : '#fff'}
        ref={ref}
        boxSizing="border-box"
      >
        {left}
        <Center h={`${HEADER_HEIGHT}px`} fontSize="18px">
          {title}
        </Center>
        {right}
      </Grid>
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

export const AppbarButton: React.FC<{
  transparent?: boolean
  onClick?: () => void
  buttonProps?: ButtonProps
}> = ({ children, transparent, onClick, ...buttonProps }) => {
  return (
    <Button
      onClick={onClick}
      w={`${HEADER_HEIGHT - 20}px`}
      height={`${HEADER_HEIGHT - 20}px`}
      borderRadius="100%"
      variant="link"
      m="auto"
      bg={transparent ? undefined : '#f6f8fA'}
      {...buttonProps}
    >
      <AppbarButtonContainer>{children}</AppbarButtonContainer>
    </Button>
  )
}
