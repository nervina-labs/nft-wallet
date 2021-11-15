import React from 'react'
import { Button as RawButton, ButtonProps } from '@mibao-ui/components'

export const Button: React.FC<ButtonProps> = ({ children, ...rest }) => {
  return (
    <RawButton
      fontWeight="normal"
      variant="solid"
      colorScheme="primary"
      size="sm"
      {...rest}
    >
      {children}
    </RawButton>
  )
}
