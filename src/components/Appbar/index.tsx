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
import { useHistoryBack } from '../../hooks/useHistoryBack'
import { ReactComponent as BackSvg } from '../../assets/svg/back.svg'

export interface AppbarProps extends React.RefAttributes<HTMLDivElement> {
  title?: React.ReactNode
  left?: React.ReactNode
  right?: React.ReactNode
  onLeftClick?: () => void
  back?: boolean
  transparent?: boolean
}

export interface AppbarButtonProps extends ButtonProps {
  transparent?: boolean
}

export interface AppbarStickyProps extends BoxProps {
  top?: number | string
  zIndex?: number
}

export const HEADER_HEIGHT = 60

export const Appbar: React.ForwardRefExoticComponent<AppbarProps> = React.forwardRef(
  ({ title, left, right, transparent, onLeftClick }, ref) => {
    const back = useHistoryBack()
    const leftEl = left ?? (
      <AppbarButton onClick={onLeftClick ?? (() => back())}>
        <BackSvg />
      </AppbarButton>
    )
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
        {leftEl}
        <Center h="40px" fontSize="18px" mt="30px">
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
  ...rest
}) => {
  return (
    <Box position="sticky" top={top} zIndex={zIndex} w="100%" {...rest}>
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
      m="auto"
      bg={transparent ? undefined : '#f6f8fA'}
      {...buttonProps}
    >
      <AppbarButtonContainer>{children}</AppbarButtonContainer>
    </Button>
  )
}
